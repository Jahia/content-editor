/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.api.templates.JahiaTemplateManagerService;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.contenteditor.api.forms.*;
import org.jahia.modules.contenteditor.graphql.api.types.ContextEntryInput;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrPropertyType;
import org.jahia.services.content.*;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.*;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializer;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializerService;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.scheduler.BackgroundJob;
import org.jahia.services.scheduler.SchedulerService;
import org.jahia.settings.SettingsBean;
import org.jahia.utils.LanguageCodeConverters;
import org.jahia.utils.i18n.Messages;
import org.osgi.framework.Bundle;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.owasp.html.Sanitizers;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.SchedulerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Implementation of the Jahia Content Editor Form service. This implementation supports merging with static form
 * definitions declared as JSON files inside DX modules.
 */
@Component(immediate = true)
public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);

    private static final String EDIT = "edit";

    private static final String CREATE = "create";

    public static final String DEFAULT_SECTION = "content";
    private NodeTypeRegistry nodeTypeRegistry;
    private ChoiceListInitializerService choiceListInitializerService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;
    private ComplexPublicationService publicationService;
    private SchedulerService schedulerService;
    private JahiaTemplateManagerService jahiaTemplateManagerService;

    // we extend the map from SelectorType.defaultSelectors to add more.
    private static Map<Integer, Integer> defaultSelectors = new HashMap<>();
    // Regex for range format of a constraint value, extracted from org.apache.jackrabbit.spi.commons.nodetype.constraint.NumericConstraint
    private static final Pattern RANGE_PATTERN = Pattern.compile("([\\(\\[]) *(\\-?\\d+\\.?\\d*)? *, *(\\-?\\d+\\.?\\d*)? *([\\)\\]])");
    private static final int LOWER_LIMIT_RANGE_IDX = 2;

    static {
        defaultSelectors.put(PropertyType.STRING, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.LONG, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.DOUBLE, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.DATE, SelectorType.DATETIMEPICKER);
        defaultSelectors.put(PropertyType.BOOLEAN, SelectorType.CHECKBOX);
        defaultSelectors.put(PropertyType.NAME, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.PATH, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.WEAKREFERENCE, SelectorType.CONTENTPICKER);
        defaultSelectors.put(PropertyType.DECIMAL, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.URI, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.REFERENCE, SelectorType.CONTENTPICKER);
        defaultSelectors.put(PropertyType.BINARY, SelectorType.SMALLTEXT);
    }

    private static final List<String> PUBLISHED_TECHNICAL_NODES = Arrays.asList("vanityUrlMapping", "j:conditionalVisibility");

    @Reference
    public void setChoiceListInitializerService(ChoiceListInitializerService choiceListInitializerService) {
        this.choiceListInitializerService = choiceListInitializerService;
    }

    @Reference
    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Reference
    public void setJahiaTemplateManagerService(JahiaTemplateManagerService jahiaTemplateManagerService) {
        this.jahiaTemplateManagerService = jahiaTemplateManagerService;
    }

    @Reference
    public void setStaticDefinitionsRegistry(StaticDefinitionsRegistry staticDefinitionsRegistry) {
        this.staticDefinitionsRegistry = staticDefinitionsRegistry;
    }

    @Reference
    public void setPublicationService(ComplexPublicationService publicationService) {
        this.publicationService = publicationService;
    }

    @Reference
    public void setSchedulerService(SchedulerService schedulerService) {
        this.schedulerService = schedulerService;
    }

    @Override
    public EditorForm getCreateForm(String primaryNodeTypeName, Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException {

        try {
            return getEditorForm(nodeTypeRegistry.getNodeType(primaryNodeTypeName), uiLocale, locale, null, resolveNodeFromPathorUUID(uuidOrPath, locale));

        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building create form definition for node: " + uuidOrPath + " and nodeType: " + primaryNodeTypeName, e);
        }
    }

    @Override
    public EditorForm getEditForm(Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException {
        try {
            JCRNodeWrapper node = resolveNodeFromPathorUUID(uuidOrPath, locale);
            return getEditorForm(node.getPrimaryNodeType(), uiLocale, locale, node, node.getParent());

        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + uuidOrPath, e);
        }
    }

    @Override
    public List<EditorFormFieldValueConstraint> getFieldConstraints(String nodeUuidOrPath,
                                                                    String parentNodeUuidOrPath,
                                                                    String primaryNodeTypeName,
                                                                    String fieldNodeType,
                                                                    String fieldName,
                                                                    List<ContextEntryInput> context,
                                                                    Locale uiLocale,
                                                                    Locale locale) throws EditorFormException {
        try {
            JCRNodeWrapper node = nodeUuidOrPath != null ? resolveNodeFromPathorUUID(nodeUuidOrPath, locale) : null;
            JCRNodeWrapper parentNode = resolveNodeFromPathorUUID(parentNodeUuidOrPath, locale);
            ExtendedPropertyDefinition fieldPropertyDefinition = nodeTypeRegistry.getNodeType(fieldNodeType).getPropertyDefinition(fieldName);

            if (fieldPropertyDefinition != null) {
                ExtendedNodeType primaryNodeType = nodeTypeRegistry.getNodeType(primaryNodeTypeName);
                EditorFormField editorFormField = generateEditorFormField(fieldPropertyDefinition, primaryNodeType, node, parentNode,
                    uiLocale, locale,
                    0.0);
                editorFormField = mergeWithStaticFormField(fieldNodeType, editorFormField);

                Map<String, Object> extendContext = new HashMap<>();
                editorFormField.getSelectorOptions().forEach(option -> extendContext.put(option.getName(), option.getValue()));
                for (ContextEntryInput contextEntry : context) {
                    if (contextEntry.getValue() != null) {
                        extendContext.put(contextEntry.getKey(), contextEntry.getValue());
                    }
                }

                return getValueConstraints(primaryNodeType, editorFormField, node, parentNode, locale, extendContext);
            }

            return Collections.emptyList();
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building field constraints for" +
                " node: " + nodeUuidOrPath +
                ", node type: " + primaryNodeTypeName +
                ", parent node: " + parentNodeUuidOrPath +
                ", field node type: " + fieldNodeType +
                ", field name: " + fieldName, e);
        }
    }

    @Override
    public boolean publishForm(Locale locale, String uuidOrPath) throws EditorFormException {
        String uuid;
        String path;
        JCRSessionWrapper session;
        try {
            JCRNodeWrapper nodeToPublish = resolveNodeFromPathorUUID(uuidOrPath, locale);
            uuid = nodeToPublish.getIdentifier();
            path = nodeToPublish.getPath();
            session = JCRSessionFactory.getInstance().getCurrentUserSession();
        } catch (RepositoryException e) {
            throw new EditorFormException("Cannot found node: " + uuidOrPath, e);
        }

        // Filter the publication infos to only keep current node and sub technical nodes associated to the current node
        Collection<ComplexPublicationService.FullPublicationInfo> filteredInfos = publicationService.getFullPublicationInfos(Collections.singleton(uuid),
                Collections.singletonList(locale.toString()), false, session)
            .stream()
            .filter(info -> info.getPublicationStatus() != PublicationInfo.DELETED) // keep only not deleted nodes
            .filter(ComplexPublicationService.FullPublicationInfo::isAllowedToPublishWithoutWorkflow) // keep only nodes allowed to bypass workflow
            .filter(info -> path.equals(info.getNodePath()) || PUBLISHED_TECHNICAL_NODES
                .stream()
                .anyMatch(technicalNodeName -> {
                    String technicalNodePath = path + "/" + technicalNodeName;
                    String technicalNodeChildPath = technicalNodePath + "/";
                    return technicalNodePath.equals(info.getNodePath()) || info.getNodePath().startsWith(technicalNodeChildPath);
                })) // keep the node itself and associated technical subnodes
            .collect(Collectors.toList());

        // Build the list of uuids to publish
        LinkedList<String> uuids = new LinkedList<>();
        for (ComplexPublicationService.FullPublicationInfo info : filteredInfos) {
            if (info.getNodeIdentifier() != null) {
                uuids.add(info.getNodeIdentifier());
            }
            if (info.getTranslationNodeIdentifier() != null) {
                uuids.add(info.getTranslationNodeIdentifier());
            }
            uuids.addAll(info.getDeletedTranslationNodeIdentifiers());
        }

        // Build the list of paths to publish
        String workspaceName = session.getWorkspace().getName();
        List<String> paths = new ArrayList<>();
        for (String uuidToPublish : uuids) {
            try {
                paths.add(session.getNodeByIdentifier(uuidToPublish).getPath());
            } catch (RepositoryException e) {
                throw new EditorFormException(e);
            }
        }

        // Schedule publication workflow
        JobDetail jobDetail = BackgroundJob.createJahiaJob("Publication", PublicationJob.class);
        JobDataMap jobDataMap = jobDetail.getJobDataMap();
        jobDataMap.put(PublicationJob.PUBLICATION_UUIDS, uuids);
        jobDataMap.put(PublicationJob.PUBLICATION_PATHS, paths);
        jobDataMap.put(PublicationJob.SOURCE, workspaceName);
        jobDataMap.put(PublicationJob.DESTINATION, Constants.LIVE_WORKSPACE);
        jobDataMap.put(PublicationJob.CHECK_PERMISSIONS, true);
        try {
            schedulerService.scheduleJobNow(jobDetail);
        } catch (SchedulerException e) {
            throw new EditorFormException(e);
        }

        return true;
    }

    private JCRNodeWrapper resolveNodeFromPathorUUID(String uuidOrPath, Locale locale) throws RepositoryException {
        if (StringUtils.startsWith(uuidOrPath, "/")) {
            return getSession(locale, uuidOrPath).getNode(uuidOrPath);
        } else {
            return getSession(locale, uuidOrPath).getNodeByIdentifier(uuidOrPath);
        }
    }

    private EditorForm getEditorForm(ExtendedNodeType primaryNodeType, Locale uiLocale, Locale locale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode) throws EditorFormException {
        final String mode = existingNode == null ? CREATE : EDIT;
        final JCRNodeWrapper currentNode = EDIT.equals(mode) ? existingNode : parentNode;

        try {
            String primaryNodeTypeName = primaryNodeType.getName();

            Map<String, EditorFormSection> formSectionsByName = new HashMap<>();
            Set<String> processedProperties = new HashSet<>();
            Set<String> processedNodeTypes = new HashSet<>();

            generateAndMergeFieldSetForType(primaryNodeType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                formSectionsByName, false, false, true, processedProperties, false);
            processedNodeTypes.add(primaryNodeTypeName);

            Set<ExtendedNodeType> nodeTypesToProcess =
                Arrays.stream(primaryNodeType.getSupertypes()).collect(Collectors.toCollection(LinkedHashSet::new));

            for (ExtendedNodeType superType : nodeTypesToProcess) {
                generateAndMergeFieldSetForType(superType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                    formSectionsByName, false, false, true, processedProperties, false);
                processedNodeTypes.add(superType.getName());
            }

            // This inserts listOrdering section for types which require it but don't come with one
            checkIfListOrderingSectionIsRequired(primaryNodeType, currentNode, formSectionsByName);
            JCRSiteNode resolvedSite;
            if (EDIT.equals(mode) && existingNode.isNodeType("jnt:virtualsite")) {
                resolvedSite = (JCRSiteNode) existingNode;
            } else {
                resolvedSite = parentNode.getResolveSite();
            }

            List<ExtendedNodeType> extendMixins = getExtendMixins(primaryNodeTypeName, resolvedSite);
            for (ExtendedNodeType extendMixinNodeType : extendMixins) {
                if (processedNodeTypes.contains(extendMixinNodeType.getName())) {
                    // ignore already process node types
                    continue;
                }
                boolean activated = EDIT.equals(mode) && existingNode.isNodeType(extendMixinNodeType.getName());
                generateAndMergeFieldSetForType(extendMixinNodeType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                    formSectionsByName, false, true, activated, processedProperties, true);
                processedNodeTypes.add(extendMixinNodeType.getName());
            }
            // Get all form definitions to merge from the primary type.
            final SortedSet<EditorFormDefinition> formDefinitionsToMerge = staticDefinitionsRegistry.getFormDefinitionsForType(primaryNodeType);

            addMixinsNodeType(primaryNodeType, uiLocale, locale, existingNode, parentNode, mode, formSectionsByName, processedProperties, processedNodeTypes, formDefinitionsToMerge);

            JCRSiteNode site = existingNode != null ? existingNode.getResolveSite() : parentNode.getResolveSite();

            EditorFormDefinition mergedFormDefinition = mergeFormDefinitions(formDefinitionsToMerge, site);
            if (mergedFormDefinition.getSections() != null) {
                List<EditorFormSectionDefinition> filteredSections = mergedFormDefinition
                    .getSections()
                    .stream()
                    .map(editorFormSectionDefinition -> {
                        editorFormSectionDefinition.setHide(shouldHideSection(editorFormSectionDefinition
                            , mode));
                        return editorFormSectionDefinition;
                    })
                    .collect(Collectors.toList());
                mergedFormDefinition.setSections(filteredSections);
            }

            List<EditorFormSection> sortedSections = sortSections(formSectionsByName, mergedFormDefinition, uiLocale, parentNode.getResolveSite());
            moveSystemName(sortedSections, primaryNodeType, currentNode, locale, mode, site);
            sortedSections = sortedSections.stream().filter(section -> {
                    EditorFormSectionDefinition sectionDefinition = mergedFormDefinition.getSections().stream().filter(s -> s.getName().equals(section.getName())).findFirst().orElse(null);
                    return sectionDefinition != null && (sectionDefinition.getRequiredPermission() == null || site.hasPermission(sectionDefinition.getRequiredPermission()));
                })
                .collect(Collectors.toList());
            String formDisplayName = primaryNodeType.getLabel(uiLocale);
            String formDescription = primaryNodeType.getDescription(uiLocale);

            return new EditorForm(primaryNodeTypeName, formDisplayName, formDescription, mergedFormDefinition.hasPreview(), sortedSections);
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + currentNode.getPath() + " and nodeType: " + primaryNodeType.getName(), e);
        }
    }

    private void addMixinsNodeType(ExtendedNodeType primaryNodeType, Locale uiLocale, Locale locale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, String mode, Map<String, EditorFormSection> formSectionsByName, Set<String> processedProperties, Set<String> processedNodeTypes, SortedSet<EditorFormDefinition> formDefinitionsToMerge) throws RepositoryException {
//        Add all the fields for the mixins and their supertypes added on the node
        Set<ExtendedNodeType> nodeTypesToProcess;
        if (EDIT.equals(mode)) {
            Set<ExtendedNodeType> addMixins = Arrays.stream(existingNode.getMixinNodeTypes()).filter(nodetype -> !processedNodeTypes.contains(nodetype.getName())).collect(Collectors.toSet());
            for (ExtendedNodeType addMixin : addMixins) {
                if (processedNodeTypes.contains(addMixin.getName())) {
                    // ignore already process node types
                    continue;
                }
                generateAndMergeFieldSetForType(addMixin, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                    formSectionsByName, false, false, true, processedProperties, false);
                processedNodeTypes.add(addMixin.getName());
                nodeTypesToProcess =
                    Arrays.stream(addMixin.getSupertypes()).collect(Collectors.toCollection(LinkedHashSet::new));

                for (ExtendedNodeType superType : nodeTypesToProcess) {
                    if (processedNodeTypes.contains(superType.getName())) {
                        // ignore already process node types
                        continue;
                    }
                    generateAndMergeFieldSetForType(superType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                        formSectionsByName, false, false, true, processedProperties, false);
                    processedNodeTypes.add(superType.getName());
                }
                // Add mixins form definitions to merge that are set on the node.
                formDefinitionsToMerge.addAll(staticDefinitionsRegistry.getFormDefinitionsForType(addMixin));
            }
        }
    }

    private boolean shouldHideSection(EditorFormSectionDefinition section, String mode) {
        return section.isHide() || (!section.getDisplayModes().isEmpty() && !section.getDisplayModes().contains(mode));
    }

    private void checkIfListOrderingSectionIsRequired(ExtendedNodeType primaryNodeType, JCRNodeWrapper existingNode, Map<String, EditorFormSection> formSectionsByName) throws RepositoryException {
        if (formSectionsByName.containsKey("listOrdering")) {
            return;
        }

        if ((primaryNodeType.hasOrderableChildNodes() || existingNode.isNodeType("jmix:orderedList"))) {
            EditorFormSection editorFormSection = new EditorFormSection();
            editorFormSection.setName("listOrdering");
            formSectionsByName.put("listOrdering", editorFormSection);
        }
    }

    private void generateAndMergeFieldSetForType(ExtendedNodeType fieldSetNodeType, Locale uiLocale, Locale locale,
                                                 JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, ExtendedNodeType primaryNodeType,
                                                 Map<String, EditorFormSection> formSectionsByName, boolean removed, boolean dynamic, boolean activated,
                                                 Set<String> processedProperties, boolean isForExtendMixin) throws RepositoryException {

        final boolean displayFieldSet = !fieldSetNodeType.isNodeType("jmix:templateMixin") || primaryNodeType.isNodeType("jmix:templateMixin");
        EditorFormFieldSet nodeTypeFieldSet = generateEditorFormFieldSet(processedProperties, fieldSetNodeType, primaryNodeType,
            existingNode, parentNode, locale, uiLocale, removed, dynamic, activated, displayFieldSet, isForExtendMixin);

        JCRSiteNode site = existingNode != null ? existingNode.getResolveSite() : parentNode.getResolveSite();

        nodeTypeFieldSet = mergeWithStaticFormFieldSets(fieldSetNodeType.getName(), nodeTypeFieldSet, processedProperties, site);

        if (!nodeTypeFieldSet.isRemoved()) {
            processValueConstraints(nodeTypeFieldSet, locale, existingNode, parentNode, primaryNodeType);
            addFieldSetToSections(formSectionsByName, nodeTypeFieldSet);
        }
    }

    private EditorFormDefinition mergeFormDefinitions(SortedSet<EditorFormDefinition> editorFormDefinitions, JCRSiteNode site) {
        EditorFormDefinition mergedEditorFormDefinition = null;
        for (EditorFormDefinition editorFormDefinition : editorFormDefinitions) {
            if (isApplicable(editorFormDefinition.getOriginBundle(), site)) {
                if (mergedEditorFormDefinition == null) {
                    mergedEditorFormDefinition = new EditorFormDefinition(editorFormDefinition.getNodeType(), editorFormDefinition.getPriority(), editorFormDefinition.hasPreview(), editorFormDefinition.getSections(), editorFormDefinition.getOriginBundle());
                } else {
                    mergedEditorFormDefinition = mergedEditorFormDefinition.mergeWith(editorFormDefinition);
                }
            }
        }
        return mergedEditorFormDefinition != null ? mergedEditorFormDefinition : new EditorFormDefinition();
    }

    private List<EditorFormSection> sortSections(Map<String, EditorFormSection> formSectionsByName, EditorFormDefinition editorFormDefinition, Locale uiLocale, JCRSiteNode site) {
        List<EditorFormSection> sortedFormSections = new ArrayList<>();
        if (editorFormDefinition.getSections() == null) {
            return sortedFormSections;
        }
        for (EditorFormSectionDefinition sectionDefinition : editorFormDefinition.getSections()) {
            EditorFormSection formSection = formSectionsByName.get(sectionDefinition.getName());
            if (formSection != null) {
                String displayName = resolveResourceKey(sectionDefinition.getLabelKey(), uiLocale, site);
                if (displayName != null) {
                    formSection.setDisplayName(displayName);
                }
                String description = resolveResourceKey(sectionDefinition.getDescriptionKey(), uiLocale, site);
                if (description != null) {
                    formSection.setDescription(description);
                }
                formSection.setHide(sectionDefinition.isHide());
                formSection.setExpanded(sectionDefinition.expanded());
                Collections.sort(formSection.getFieldSets());
                sortedFormSections.add(formSection);
            }
        }
        return sortedFormSections;
    }

    private void moveSystemName(List<EditorFormSection> sections, ExtendedNodeType primaryNodeType, JCRNodeWrapper currentNode, Locale locale, String mode, JCRSiteNode site) throws RepositoryException {
        EditorFormSection sectionWithNtBase = sections.stream().filter(s -> s.getFieldSets().stream().anyMatch(fs -> fs.getName().equals("nt:base"))).findFirst().orElse(null);

        if (sectionWithNtBase == null) {
            return;
        }

        EditorFormFieldSet ntBaseFieldSet = sectionWithNtBase.getFieldSets().stream().filter(fs -> fs.getName().equals("nt:base")).findFirst().orElseThrow(() -> new RuntimeException("Could not find nt:base field set"));
        EditorFormField systemNameField = ntBaseFieldSet.getEditorFormFields().stream().filter(ff -> ff.getName().equals("ce:systemName")).findFirst().orElseThrow(() -> new RuntimeException("Could not find ce:systemName field"));

        EditorFormProperty maxLength = new EditorFormProperty();
        maxLength.setName("maxLength");
        maxLength.setValue(String.valueOf(SettingsBean.getInstance().getMaxNameSize()));
        systemNameField.setSelectorOptions(Collections.singletonList(maxLength));

        List<String> readOnlyNodeTypes = Arrays.asList(
            "jnt:group",
            "jnt:groupsFolder",
            "jnt:mounts",
            "jnt:remotePublications",
            "jnt:modules",
            "jnt:module",
            "jnt:moduleVersion",
            "jnt:templateSets",
            "jnt:user",
            "jnt:usersFolder",
            "jnt:virtualsite",
            "jnt:virtualsitesFolder"
        );
        List<String> systemNameOnTopNodeTypes = Arrays.asList(
            "jnt:page",
            "jnt:contentFolder",
            "jnt:folder",
            "jnt:file",
            "jnt:category",
            "jmix:mainResource"
        );

        Pattern pathPattern = Pattern.compile("^/sites/[^/]*/(contents|files)$");
        if (readOnlyNodeTypes.contains(primaryNodeType.getName())
            || (EDIT.equals(mode) && currentNode.isNodeType("jmix:systemNameReadonly"))
            || (EDIT.equals(mode) && pathPattern.matcher(currentNode.getPath()).matches())
            || (EDIT.equals(mode) && !currentNode.hasPermission("jcr:modifyProperties_default_" + locale.getLanguage()))
            || JCRContentUtils.isLockedAndCannotBeEdited(currentNode)) {
            systemNameField.setReadOnly(true);
        } else {
            systemNameField.setReadOnly(false);
        }

        // Move system name field under jcr title field if one exists
        boolean movedSystemNameField = moveSystemNameFieldUnderTitleField(sections, systemNameField);

        if (!movedSystemNameField && systemNameOnTopNodeTypes.contains(primaryNodeType.getName())) {
            movedSystemNameField = moveSystemNameToTheTopOfTheForm(sections, systemNameField, primaryNodeType, site);
        }

        if (movedSystemNameField) {
            sectionWithNtBase.getFieldSets().remove(ntBaseFieldSet);
        }

        // Remove empty sections
        sections.removeIf(s -> !s.getName().equals("listOrdering") && s.getFieldSets().isEmpty());
    }

    private boolean moveSystemNameFieldUnderTitleField(List<EditorFormSection> sections, EditorFormField systemNameField) {
        boolean moved = false;
        for (EditorFormSection s : sections) {
            for (EditorFormFieldSet fs : s.getFieldSets()) {
                LinkedHashSet<EditorFormField> newSet = new LinkedHashSet<>();
                for (EditorFormField f : fs.getEditorFormFields()) {
                    newSet.add(f);
                    if (f.getName().equals("jcr:title")) {
                        newSet.add(systemNameField);
                        moved = true;
                    }
                }

                if (moved) {
                    fs.setEditorFormFields(newSet);
                    return true;
                }
            }
        }

        return false;
    }

    private boolean moveSystemNameToTheTopOfTheForm(List<EditorFormSection> sections, EditorFormField systemNameField, ExtendedNodeType primaryNodeType, JCRSiteNode site) {
        EditorFormSection contentSection = sections.stream().filter(s -> s.getName().equals("content")).findFirst().orElse(new EditorFormSection());
        EditorFormFieldSet nodeTypeFiledSet = contentSection.getFieldSets().stream().filter(fs -> fs.getName().equals(primaryNodeType.getName())).findFirst().orElse(new EditorFormFieldSet());

        if (contentSection.getName() == null && !site.hasPermission("viewContentTab")) {
            return false;
        }

        if (contentSection.getName() == null) {
            contentSection.setName("content");
            sections.add(0, contentSection);
        }

        if (nodeTypeFiledSet.getName() == null) {
            nodeTypeFiledSet.setName(primaryNodeType.getName());
            nodeTypeFiledSet.setDisplayName(primaryNodeType.getLocalName());
            nodeTypeFiledSet.setActivated(true);
            nodeTypeFiledSet.setDisplayed(true);
            nodeTypeFiledSet.setDynamic(false);
            contentSection.getFieldSets().add(0, nodeTypeFiledSet);
        }

        LinkedHashSet<EditorFormField> newSet = new LinkedHashSet<>();
        newSet.add(systemNameField);
        newSet.addAll(nodeTypeFiledSet.getEditorFormFields());
        nodeTypeFiledSet.setEditorFormFields(newSet);
        return true;
    }

    private static String resolveResourceKey(String key, Locale locale, JCRSiteNode site) {
        // Copied from org.jahia.ajax.gwt.helper.UIConfigHelper.getResources
        // Todo: BACKLOG-10823 - avoid code duplication and use a static shared utility function
        if (key == null || key.length() == 0) {
            return key;
        }
        logger.debug("Resources key: {}", key);
        String baseName = null;
        String value;
        if (key.contains("@")) {
            baseName = StringUtils.substringAfter(key, "@");
            key = StringUtils.substringBefore(key, "@");
        }

        value = Messages.get(baseName, site != null ? site.getTemplatePackage() : null, key, locale, StringUtils.EMPTY);
        if (value == null) {
            value = Messages.getInternal(key, locale);
        }
        return value;
    }

    private void addFieldSetToSections(Map<String, EditorFormSection> formSectionsByName, EditorFormFieldSet formFieldSet) {
        if (Boolean.FALSE.equals(formFieldSet.getDynamic()) && formFieldSet.getEditorFormFields().isEmpty()) {
            // in the case of an empty static mixin or parent type we don't add it to the form
            return;
        }

        // Move fields to their final section/fieldset
        List<EditorFormField> toBeRemoved = new ArrayList<>();
        formFieldSet.getEditorFormFields().forEach(editorFormField -> {
            String fieldSetName = editorFormField.getTarget().getFieldSetName();
            if (!(editorFormField.getTarget() == null || fieldSetName == null || fieldSetName.equals(formFieldSet.getName()))) {
                EditorFormSection editorFormSection = formSectionsByName.get(editorFormField.getTarget().getSectionName());
                if (editorFormSection != null) {
                    if (fieldSetName.equals("<main>")) {
                        logger.debug("Moving field {} to <main> in fieldset {} of section {}", editorFormField.getName(), editorFormSection.getFieldSets().get(0).getName(), editorFormSection.getName());
                        editorFormSection.getFieldSets().get(0).getEditorFormFields().add(editorFormField);
                        toBeRemoved.add(editorFormField);
                    } else {
                        editorFormSection.getFieldSets().forEach(editorFormFieldSet -> {
                            if (editorFormFieldSet.getName().equals(fieldSetName)) {
                                logger.debug("Moving field {} to fieldset {} of section {}", editorFormField.getName(), editorFormFieldSet.getName(), editorFormSection.getName());
                                editorFormFieldSet.getEditorFormFields().add(editorFormField);
                                toBeRemoved.add(editorFormField);
                            }
                        });
                    }
                }
            }
        });
        if (!toBeRemoved.isEmpty()) {
            if(logger.isDebugEnabled()) {
                logger.debug("Removing {} fields from fieldset {}", toBeRemoved.stream().map(EditorFormField::getName).collect(Collectors.joining(",")), formFieldSet.getName());
            }
            toBeRemoved.forEach(formFieldSet.getEditorFormFields()::remove);
        }
        String targetSectionName = resolveMainSectionName(formFieldSet);
        EditorFormSection targetSection = formSectionsByName.get(targetSectionName);
        if (targetSection == null) {
            Double targetSectionRank = 1.0;
            Double targetSectionPriority = 1.0;
            targetSection = new EditorFormSection(targetSectionName, targetSectionName, null, targetSectionRank, targetSectionPriority,
                new ArrayList<>(), false);
        }

        if (formFieldSet.getRank().compareTo(0.0) == 0) {
            formFieldSet.setRank((double) targetSection.getFieldSets().size() + 1);
        }

        targetSection.getFieldSets().add(formFieldSet);
        formSectionsByName.put(targetSection.getName(), targetSection);
    }

    private String resolveMainSectionName(EditorFormFieldSet fieldSet) {
        String targetSectionName = fieldSet.getTarget().getSectionName() != null ? fieldSet.getTarget().getSectionName() : DEFAULT_SECTION;
        for (EditorFormField field : fieldSet.getEditorFormFields()) {
            EditorFormFieldTarget sectionTarget = field.getTarget();
            // Keep in mind that it could be the case that targetSectionName name will not be the same as section name for all fields (based on previous code).
            // It is not clear where to put that field at that point. The concept itself is quite strange since intuition would suggest that a fieldset cannot be
            // in more than one section at a time. I preserved original behaviour here to not get into a lot of refactoring.
            if (sectionTarget != null && sectionTarget.getSectionName() != null) {
                targetSectionName = sectionTarget.getSectionName();
                break;
            }
        }
        return targetSectionName;
    }

    private void processValueConstraints(EditorFormFieldSet editorFormFieldSet, Locale locale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, ExtendedNodeType primaryNodeType) throws RepositoryException {
        for (EditorFormField editorFormField : editorFormFieldSet.getEditorFormFields()) {
            List<EditorFormFieldValueConstraint> valueConstraints = getValueConstraints(primaryNodeType, editorFormField, existingNode, parentNode, locale, new HashMap<>());
            editorFormField.setValueConstraints(valueConstraints);
        }
    }

    private EditorFormFieldSet mergeWithStaticFormFieldSets(String nodeTypeName, EditorFormFieldSet mergedEditorFormFieldSet, Set<String> processedProperties, JCRSiteNode site) {
        SortedSet<EditorFormFieldSet> staticEditorFormFieldSets = staticDefinitionsRegistry.getFormFieldSets(nodeTypeName);
        if (staticEditorFormFieldSets == null) {
            return mergedEditorFormFieldSet;
        }

        for (EditorFormFieldSet staticEditorFormFieldSet : staticEditorFormFieldSets) {
            if (isApplicable(staticEditorFormFieldSet.getOriginBundle(), site)) {
                mergedEditorFormFieldSet = mergedEditorFormFieldSet.mergeWith(staticEditorFormFieldSet, processedProperties);
            }
        }
        return mergedEditorFormFieldSet;
    }

    private EditorFormField mergeWithStaticFormField(String nodeType, EditorFormField editorFormField) {
        SortedSet<EditorFormFieldSet> staticEditorFormFieldSets = staticDefinitionsRegistry.getFormFieldSets(nodeType);

        for (EditorFormFieldSet fieldSet : (staticEditorFormFieldSets == null ? Collections.<EditorFormFieldSet>emptyList() : staticEditorFormFieldSets)) {
            for (EditorFormField field : fieldSet.getEditorFormFields()) {
                if (field.getName().equals(editorFormField.getName())) {
                    editorFormField = editorFormField.mergeWith(field);
                    break;
                }
            }
        }

        return editorFormField;
    }

    private EditorFormFieldSet generateEditorFormFieldSet(Set<String> processedProperties, ExtendedNodeType nodeType,
        ExtendedNodeType primaryNodeType, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale locale, Locale uiLocale,
        Boolean removed, Boolean dynamic, Boolean activated, Boolean displayed, Boolean isForExtendMixin) throws RepositoryException {
        boolean isLockedAndCannotBeEdited = JCRContentUtils.isLockedAndCannotBeEdited(existingNode);
        boolean fieldSetEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:nodeTypeManagement"));

        SortedSet<EditorFormField> editorFormFields = new TreeSet<>();
        Map<String, Double> maxTargetRank = new HashMap<>();

        List<ExtendedItemDefinition> itemDefinitions = isForExtendMixin ? nodeType.getItems() : nodeType.getDeclaredItems(true);
        for (ExtendedItemDefinition itemDefinition : itemDefinitions) {
            // do not return hidden props
            if (itemDefinition.isNode() || itemDefinition.isHidden() || itemDefinition.isUnstructured() || processedProperties.contains(itemDefinition.getName())) {
                processedProperties.add(itemDefinition.getName());
                continue;
            }

            String itemType = itemDefinition.getItemType();
            Double rank = maxTargetRank.get(itemType);
            if (rank == null) {
                rank = -1.0;
            }
            rank++;
            maxTargetRank.put(itemType, rank);

            EditorFormField editorFormField = generateEditorFormField(itemDefinition, primaryNodeType,
                existingNode, parentNode, uiLocale, locale, rank);

            editorFormFields.add(editorFormField);
            if (!dynamic) {
                processedProperties.add(itemDefinition.getName());
            }
        }

        String displayName = StringEscapeUtils.unescapeHtml(nodeType.getLabel(uiLocale));
        String description = Sanitizers.FORMATTING.sanitize(nodeType.getDescription(uiLocale));

        EditorFormFieldSet fieldset = new EditorFormFieldSet(
            nodeType.getName(),
            displayName,
            description,
            removed,
            dynamic,
            activated,
            displayed,
            !fieldSetEditable,
            editorFormFields
        );

        // Set correct target for fieldset itself which will be used in case the fieldset doesn't have fields i. e. mixin definition without properties
        fieldset.setTarget(new EditorFormFieldTarget(nodeType.getItemsType(), nodeType.getName(), -0.1));

        return fieldset;
    }

    private EditorFormField generateEditorFormField(ExtendedItemDefinition itemDefinition, ExtendedNodeType primaryNodeType,
        JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale uiLocale, Locale locale, Double rank) throws RepositoryException {
        JCRSessionWrapper session = existingNode != null ? existingNode.getSession() : parentNode.getSession();

        boolean isLockedAndCannotBeEdited = JCRContentUtils.isLockedAndCannotBeEdited(existingNode);
        boolean sharedFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties"));
        boolean i18nFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties_" + session.getWorkspace().getName() + "_" + locale.toString()));

        ExtendedPropertyDefinition propertyDefinition = (ExtendedPropertyDefinition) itemDefinition;

        ExtendedNodeType declaringNodeType = propertyDefinition.getDeclaringNodeType();
        EditorFormFieldTarget fieldTarget = new EditorFormFieldTarget(propertyDefinition.getItemType(), declaringNodeType.getName(), rank);
        List<EditorFormFieldValueConstraint> valueConstraints = new ArrayList<>();
        for (String valueConstraint : propertyDefinition.getValueConstraints()) {
            // Check if the constraint value is a range of numeric value
            // Always take the lower boundary
            if (propertyDefinition.getSelector() == SelectorType.CHOICELIST && (
                propertyDefinition.getRequiredType() == PropertyType.DOUBLE ||
                    propertyDefinition.getRequiredType() == PropertyType.LONG ||
                    propertyDefinition.getRequiredType() == PropertyType.DECIMAL)) {
                try {
                    Matcher rangeMatcher = RANGE_PATTERN.matcher(valueConstraint);
                    if (rangeMatcher.matches()) {
                        valueConstraint = rangeMatcher.group(LOWER_LIMIT_RANGE_IDX);
                    }
                    // Cast double to long to match the constraint type
                    if (propertyDefinition.getRequiredType() == PropertyType.LONG) {
                        valueConstraint = Long.toString(Double.valueOf(valueConstraint).longValue());
                    }
                } catch (Exception e) {
                    // it's not, keep value as it is
                }
            }
            valueConstraints.add(new EditorFormFieldValueConstraint(valueConstraint, null, new EditorFormFieldValue("String", valueConstraint), null));
        }
        List<EditorFormProperty> selectorOptions = null;
        if (propertyDefinition.getSelectorOptions() != null) {
            selectorOptions = new ArrayList<>();
            for (Map.Entry<String, String> selectorOptionsEntry : propertyDefinition.getSelectorOptions().entrySet()) {
                selectorOptions.add(new EditorFormProperty(selectorOptionsEntry.getKey(), selectorOptionsEntry.getValue()));
            }
        }
        List<EditorFormFieldValue> defaultValues = null;
        if (propertyDefinition.getDefaultValues() != null) {
            defaultValues = new ArrayList<>();
            for (Value defaultValue : propertyDefinition.getDefaultValues(locale)) {
                try {
                    defaultValues.add(new EditorFormFieldValue(defaultValue));
                } catch (RepositoryException e) {
                    logger.error("Error converting field " + propertyDefinition.getName() + " default value", e);
                }
            }
        }
        List<EditorFormFieldValue> currentValues = null;
        if (existingNode != null) {
            if (existingNode.hasProperty(propertyDefinition.getName())) {
                currentValues = new ArrayList<>();
                JCRPropertyWrapper existingProperty = existingNode.getProperty(propertyDefinition.getName());
                if (existingProperty != null && existingProperty.getDefinition().equals(propertyDefinition)) {
                    if (propertyDefinition.isMultiple()) {
                        for (Value value : existingProperty.getValues()) {
                            currentValues.add(new EditorFormFieldValue(value));
                        }
                    } else {
                        currentValues.add(new EditorFormFieldValue(existingProperty.getValue()));
                    }
                }
            }
        }

        ExtendedNodeType extendedNodeType = NodeTypeRegistry.getInstance().getNodeType(propertyDefinition.getDeclaringNodeType().getAlias());
        // Use item definition to resolve labels. (same way as ContentDefinitionHelper.getGWTJahiaNodeType())
        Optional<ExtendedItemDefinition> optionalItem = extendedNodeType.getItems().stream().filter(item -> StringUtils.equals(item.getName(), propertyDefinition.getName())).findAny();
        ExtendedItemDefinition item = optionalItem.isPresent() ? optionalItem.get() : propertyDefinition;

        String propertyLabel = StringEscapeUtils.unescapeHtml(item.getLabel(uiLocale, primaryNodeType));
        String propertyDescription = Sanitizers.FORMATTING.sanitize(item.getTooltip(uiLocale, primaryNodeType));
        propertyLabel = StringUtils.isEmpty(propertyLabel) ? StringEscapeUtils.unescapeHtml(item.getLabel(uiLocale, extendedNodeType)) :
            propertyLabel;
        propertyDescription = StringUtils.isEmpty(propertyDescription) ? Sanitizers.FORMATTING.sanitize(
            item.getTooltip(uiLocale,extendedNodeType)) : propertyDescription;

        String key = itemDefinition.getResourceBundleKey() + ".constraint.error.message";
        if (itemDefinition.getDeclaringNodeType().getTemplatePackage() != null) {
            key += "@" + itemDefinition.getDeclaringNodeType().getTemplatePackage().getResourceBundleName();
        }
        String propertyErrorMessage = resolveResourceKey(key, uiLocale, parentNode.getResolveSite());

        String selectorType = SelectorType.nameFromValue(propertyDefinition.getSelector());
        if (selectorType == null) {
            // selector type was not found in the list of selector types in the core, let's try our more expanded one
            if (defaultSelectors.containsKey(propertyDefinition.getRequiredType())) {
                selectorType = SelectorType.nameFromValue(defaultSelectors.get(propertyDefinition.getRequiredType()));
            } else {
                logger.warn("Couldn't resolve a default selector type for property " + propertyDefinition.getName());
            }
        }
        GqlJcrPropertyType requiredType = GqlJcrPropertyType.fromValue(propertyDefinition.getRequiredType());

        EditorFormField field = new EditorFormField();
        field.setName(propertyDefinition.getName());
        field.setDisplayName(propertyLabel);
        field.setDescription(propertyDescription);
        field.setErrorMessage(propertyErrorMessage);
        field.setRequiredType(requiredType);
        field.setSelectorType(selectorType);
        field.setSelectorOptions(selectorOptions);
        field.setI18n(propertyDefinition.isInternationalized());
        field.setReadOnly(isFieldReadOnly(propertyDefinition, sharedFieldsEditable, i18nFieldsEditable));
        field.setMultiple(propertyDefinition.isMultiple());
        field.setMandatory(propertyDefinition.isMandatory());
        field.setValueConstraints(valueConstraints);
        field.setDefaultValues(defaultValues);
        field.setCurrentValues(currentValues);
        field.setRemoved(null);
        field.setTarget(fieldTarget);
        field.setExtendedPropertyDefinition(propertyDefinition);
        field.setDeclaringNodeType(propertyDefinition.getDeclaringNodeType().getName());
        return field;
    }

    private List<EditorFormFieldValueConstraint> getValueConstraints(ExtendedNodeType primaryNodeType, EditorFormField editorFormField, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale locale, Map<String, Object> extendContext) throws RepositoryException {
        ExtendedPropertyDefinition propertyDefinition = editorFormField.getExtendedPropertyDefinition();
        if (propertyDefinition != null && propertyDefinition.getSelector() == SelectorType.CHOICELIST) {
            List<EditorFormProperty> selectorOptions = editorFormField.getSelectorOptions();
            Map<String, ChoiceListInitializer> initializers = choiceListInitializerService.getInitializers();

            Map<String, Object> context = new HashMap<>();
            context.put("contextType", primaryNodeType);
            context.put("contextNode", existingNode);
            context.put("contextParent", parentNode);
            context.putAll(extendContext);
            List<ChoiceListValue> initialChoiceListValues = new ArrayList<>();
            for (EditorFormProperty selectorProperty : selectorOptions) {
                if (initializers.containsKey(selectorProperty.getName())) {
                    initialChoiceListValues = initializers.get(selectorProperty.getName()).getChoiceListValues(propertyDefinition, selectorProperty.getValue(), initialChoiceListValues, locale, context);
                }
            }
            List<EditorFormFieldValueConstraint> valueConstraints = new ArrayList<>();
            for (ChoiceListValue choiceListValue : initialChoiceListValues) {
                List<EditorFormProperty> propertyList = new ArrayList<>();
                if (choiceListValue.getProperties() != null) {
                    for (Map.Entry<String, Object> choiceListPropertyEntry : choiceListValue.getProperties().entrySet()) {
                        propertyList.add(new EditorFormProperty(choiceListPropertyEntry.getKey(), choiceListPropertyEntry.getValue().toString()));
                    }
                }
                try {
                    valueConstraints.add(new EditorFormFieldValueConstraint(choiceListValue.getDisplayName(), null,
                        new EditorFormFieldValue(choiceListValue.getValue()),
                        propertyList
                    ));
                } catch (RepositoryException e) {
                    logger.error("Error retrieving choice list value", e);
                }
            }
            return valueConstraints;
        }
        return editorFormField.getValueConstraints();
    }

    private boolean isFieldReadOnly(ExtendedPropertyDefinition propertyDefinition, boolean sharedFieldsEditable, boolean i18nFieldsEditable) {
        if (propertyDefinition.isProtected()) {
            return true;
        }

        return propertyDefinition.isInternationalized() ? !i18nFieldsEditable : !sharedFieldsEditable;
    }

    private JCRSessionWrapper getSession(Locale locale, String uuidOrPath) throws RepositoryException {
        Locale fallbackLocale = JCRTemplate.getInstance().doExecuteWithSystemSession(jcrSessionWrapper -> {
            JCRNodeWrapper node;
            if (StringUtils.startsWith(uuidOrPath, "/")) {
                node = jcrSessionWrapper.getNode(uuidOrPath);
            } else {
                node = jcrSessionWrapper.getNodeByIdentifier(uuidOrPath);
            }

            JCRSiteNode site = node.getResolveSite();
            if (site != null && site.isMixLanguagesActive()) {
                return LanguageCodeConverters.getLocaleFromCode(site.getDefaultLanguage());
            }

            return null;
        });

        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale, fallbackLocale);
    }

    private List<ExtendedNodeType> getExtendMixins(String type, JCRSiteNode site) throws NoSuchNodeTypeException {
        ArrayList<ExtendedNodeType> res = new ArrayList<ExtendedNodeType>();
        Set<String> foundTypes = new HashSet<String>();

        Set<String> installedModules = site != null && site.getPath().startsWith("/sites/") ? site.getInstalledModulesWithAllDependencies()
            : null;

        Map<ExtendedNodeType, Set<ExtendedNodeType>> m = NodeTypeRegistry.getInstance().getMixinExtensions();

        ExtendedNodeType realType = NodeTypeRegistry.getInstance().getNodeType(type);
        for (ExtendedNodeType nodeType : m.keySet()) {
            if (realType.isNodeType(nodeType.getName())) {
                for (ExtendedNodeType extension : m.get(nodeType)) {
//                        ctx.put("contextType", realType);
                    if (installedModules == null || extension.getTemplatePackage() == null ||
                        extension.getTemplatePackage().getModuleType().equalsIgnoreCase("system") ||
                        installedModules.contains(extension.getTemplatePackage().getId())) {
                        res.add(extension);
                        foundTypes.add(extension.getName());
                    }
                }
            }
        }

        return res;
    }

    boolean isApplicable(Bundle bundle, JCRSiteNode site) {
        JahiaTemplatesPackage tpl = jahiaTemplateManagerService.getTemplatePackageById(bundle.getSymbolicName());
        if ("system".equals(tpl.getModuleType())) {
            return true;
        }

        return site.getInstalledModulesWithAllDependencies().contains(bundle.getSymbolicName());
    }
}
