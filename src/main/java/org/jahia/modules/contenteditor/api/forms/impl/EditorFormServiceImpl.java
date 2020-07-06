/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
 */
package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.modules.contenteditor.api.forms.*;
import org.jahia.modules.contenteditor.graphql.api.types.ContextEntryInput;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrPropertyType;
import org.jahia.services.content.*;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.*;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializer;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializerService;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.utils.i18n.Messages;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of the Jahia Content Editor Form service. This implementation supports merging with static form
 * definitions declared as JSON files inside DX modules.
 */
@Component(immediate = true)
public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    public static final String DEFAULT_FORM_DEFINITION_NAME = "default";
    private NodeTypeRegistry nodeTypeRegistry;
    private ChoiceListInitializerService choiceListInitializerService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;

    // we extend the map from SelectorType.defaultSelectors to add more.
    private static Map<Integer, Integer> defaultSelectors = new HashMap<>();

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

    @Reference
    public void setChoiceListInitializerService(ChoiceListInitializerService choiceListInitializerService) {
        this.choiceListInitializerService = choiceListInitializerService;
    }

    @Reference
    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Reference
    public void setStaticDefinitionsRegistry(StaticDefinitionsRegistry staticDefinitionsRegistry) {
        this.staticDefinitionsRegistry = staticDefinitionsRegistry;
    }

    @Override
    public EditorForm getCreateForm(String primaryNodeTypeName, Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException {

        try {
            return getEditorForm(nodeTypeRegistry.getNodeType(primaryNodeTypeName), uiLocale, locale, null, resolveNodeFromPathorUUID(uuidOrPath));

        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building create form definition for node: " + uuidOrPath + " and nodeType: " + primaryNodeTypeName, e);
        }
    }

    @Override
    public EditorForm getEditForm(Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException {
        try {
            JCRNodeWrapper node = resolveNodeFromPathorUUID(uuidOrPath);
            return getEditorForm(node.getPrimaryNodeType(), uiLocale, locale, node, node.getParent());

        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + uuidOrPath, e);
        }
    }

    @Override
    public List<EditorFormFieldValueConstraint> getFieldConstraints(String nodeUuidOrPath,
                                                                    String parentNodeUuidOrPath,
                                                                    String primaryNodeType,
                                                                    String fieldNodeType,
                                                                    String fieldName,
                                                                    List<ContextEntryInput> context,
                                                                    Locale uiLocale,
                                                                    Locale locale) throws EditorFormException {
        try {
            JCRNodeWrapper node = nodeUuidOrPath != null ? resolveNodeFromPathorUUID(nodeUuidOrPath) : null;
            JCRNodeWrapper parentNode = resolveNodeFromPathorUUID(parentNodeUuidOrPath);
            ExtendedPropertyDefinition fieldPropertyDefinition = nodeTypeRegistry.getNodeType(fieldNodeType).getPropertyDefinition(fieldName);

            if (fieldPropertyDefinition != null) {
                EditorFormField editorFormField = generateEditorFormField(fieldPropertyDefinition, node, parentNode, uiLocale, locale, 0.0);
                editorFormField = mergeWithStaticFormField(fieldNodeType, editorFormField);

                Map<String, Object> extendContext = new HashMap<>();
                for (ContextEntryInput contextEntry : context) {
                    extendContext.put(contextEntry.getKey(), contextEntry.getValue());
                }

                return getValueConstraints(nodeTypeRegistry.getNodeType(primaryNodeType), editorFormField, node, parentNode, uiLocale, extendContext);
            }

            return Collections.emptyList();
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building field constraints for" +
                " node: " + nodeUuidOrPath +
                ", node type: " + primaryNodeType +
                ", parent node: " + parentNodeUuidOrPath +
                ", field node type: " + fieldNodeType +
                ", field name: " + fieldName, e);
        }
    }

    private JCRNodeWrapper resolveNodeFromPathorUUID(String uuidOrPath) throws RepositoryException {
        if (StringUtils.startsWith(uuidOrPath, "/")) {
            return getSession().getNode(uuidOrPath);
        } else {
            return getSession().getNodeByIdentifier(uuidOrPath);
        }
    }

    private EditorForm getEditorForm(ExtendedNodeType primaryNodeType, Locale uiLocale, Locale locale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode) throws EditorFormException {
        final JCRNodeWrapper currentNode = existingNode != null ? existingNode : parentNode;

        try {
            String primaryNodeTypeName = primaryNodeType.getName();
            SortedSet<EditorFormDefinition> editorFormDefinitions = staticDefinitionsRegistry.getFormDefinitions(primaryNodeType.getName());
            if (editorFormDefinitions == null) {
                editorFormDefinitions = staticDefinitionsRegistry.getFormDefinitions(DEFAULT_FORM_DEFINITION_NAME);
            }
            if (editorFormDefinitions == null) {
                logger.error("Couldn't find any form definitions, even default is missing !");
                return null;
            }
            EditorFormDefinition mergedFormDefinition = mergeFormDefinitions(editorFormDefinitions);
            List<EditorFormSectionDefinition> filteredSections = mergedFormDefinition.getSections().stream().filter(section -> section.getRequiredPermission() == null || currentNode.hasPermission(section.getRequiredPermission())).collect(Collectors.toList());
            mergedFormDefinition.setSections(filteredSections);

            Map<String, EditorFormSection> formSectionsByName = new HashMap<>();
            Set<String> processedProperties = new HashSet<>();
            Set<String> processedNodeTypes = new HashSet<>();

            generateAndMergeFieldSetForType(primaryNodeType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                formSectionsByName, false, false, true, processedProperties, false);
            processedNodeTypes.add(primaryNodeTypeName);

            Set<ExtendedNodeType> nodeTypesToProcess = Arrays.stream(primaryNodeType.getSupertypes()).collect(Collectors.toSet());

            for (ExtendedNodeType superType : nodeTypesToProcess) {
                generateAndMergeFieldSetForType(superType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                    formSectionsByName, false, false, true, processedProperties, false);
                processedNodeTypes.add(superType.getName());
            }

            JCRSiteNode resolvedSite;
            if (existingNode != null && existingNode.isNodeType("jnt:virtualsite")) {
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
                boolean activated = false;
                if (existingNode != null && existingNode.isNodeType(extendMixinNodeType.getName())) {
                    activated = true;
                }
                generateAndMergeFieldSetForType(extendMixinNodeType, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                    formSectionsByName, false, true, activated, processedProperties, true);
                processedNodeTypes.add(extendMixinNodeType.getName());
            }

            if (existingNode != null) {
                Set<ExtendedNodeType> addMixins = Arrays.stream(existingNode.getMixinNodeTypes()).filter(nodetype -> !processedNodeTypes.contains(nodetype.getName())).collect(Collectors.toSet());
                for (ExtendedNodeType addMixin : addMixins) {
                    generateAndMergeFieldSetForType(addMixin, uiLocale, locale, existingNode, parentNode, primaryNodeType,
                        formSectionsByName, false, false, true, processedProperties, false);
                }
            }

            List<EditorFormSection> sortedSections = sortSections(formSectionsByName, mergedFormDefinition, uiLocale, parentNode.getResolveSite());
            String formDisplayName = primaryNodeType.getLabel(uiLocale);
            String formDescription = primaryNodeType.getDescription(uiLocale);

            return new EditorForm(primaryNodeTypeName, formDisplayName, formDescription, sortedSections);
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + currentNode.getPath() + " and nodeType: " + primaryNodeType.getName(), e);
        }
    }

    private void generateAndMergeFieldSetForType(ExtendedNodeType fieldSetNodeType, Locale uiLocale, Locale locale,
        JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, ExtendedNodeType primaryNodeType,
        Map<String, EditorFormSection> formSectionsByName, boolean removed, boolean dynamic, boolean activated,
        Set<String> processedProperties, boolean isForExtendMixin) throws RepositoryException {
        final boolean displayFieldSet = !fieldSetNodeType.isNodeType("jmix:templateMixin");
        EditorFormFieldSet nodeTypeFieldSet = generateEditorFormFieldSet(processedProperties, fieldSetNodeType, existingNode, parentNode,
            locale, uiLocale, removed, dynamic, activated, displayFieldSet, isForExtendMixin);
        nodeTypeFieldSet = mergeWithStaticFormFieldSets(fieldSetNodeType.getName(), nodeTypeFieldSet);
        nodeTypeFieldSet = processValueConstraints(nodeTypeFieldSet, locale, existingNode, parentNode, primaryNodeType);
        if (!nodeTypeFieldSet.isRemoved()) {
            addFieldSetToSections(formSectionsByName, nodeTypeFieldSet);
        }
    }

    private EditorFormDefinition mergeFormDefinitions(SortedSet<EditorFormDefinition> editorFormDefinitions) {
        EditorFormDefinition mergedEditorFormDefinition = null;
        for (EditorFormDefinition editorFormDefinition : editorFormDefinitions) {
            if (mergedEditorFormDefinition == null) {
                mergedEditorFormDefinition = new EditorFormDefinition(editorFormDefinition.getName(), editorFormDefinition.getPriority(), editorFormDefinition.getSections(), editorFormDefinition.getOriginBundle());
            } else {
                mergedEditorFormDefinition = mergedEditorFormDefinition.mergeWith(editorFormDefinition);
            }
        }
        return mergedEditorFormDefinition;
    }

    private List<EditorFormSection> sortSections(Map<String, EditorFormSection> formSectionsByName, EditorFormDefinition editorFormDefinition, Locale uiLocale, JCRSiteNode site) {
        List<EditorFormSection> sortedFormSections = new ArrayList<>();
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
                Collections.sort(formSection.getFieldSets());
                sortedFormSections.add(formSection);
            }
        }
        return sortedFormSections;
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
        String targetSectionName = resolveMainSectionName(formFieldSet);
        EditorFormSection targetSection = formSectionsByName.get(targetSectionName);
        if (targetSection == null) {
            Double targetSectionRank = 1.0;
            Double targetSectionPriority = 1.0;
            targetSection = new EditorFormSection(targetSectionName, targetSectionName, null, targetSectionRank, targetSectionPriority, new ArrayList<>());
        }
        formFieldSet.setRank((double) targetSection.getFieldSets().size() + 1);
        if (Boolean.FALSE.equals(formFieldSet.getDynamic()) && formFieldSet.getEditorFormFields().isEmpty()) {
            // in the case of an empty static mixin or parent type we don't add it to the form
            return;
        }
        targetSection.getFieldSets().add(formFieldSet);
        formSectionsByName.put(targetSection.getName(), targetSection);
    }

    private String resolveMainSectionName(EditorFormFieldSet fieldSet) {
        String targetSectionName = null;
        for (EditorFormField field : fieldSet.getEditorFormFields()) {
            // let's check what target they have in case we have to move them.
            if (targetSectionName == null) {
                targetSectionName = field.getTarget().getSectionName();
            } else if (!targetSectionName.equals(field.getTarget().getSectionName())) {
                // field should be moved to another section, but in which field set ?
                // todo should we do this ?
            }
        }
        if (targetSectionName == null) {
            targetSectionName = "content";
        }
        return targetSectionName;
    }

    private EditorFormFieldSet processValueConstraints(EditorFormFieldSet editorFormFieldSet, Locale uiLocale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, ExtendedNodeType primaryNodeType) throws RepositoryException {
        SortedSet<EditorFormField> newEditorFormFields = new TreeSet<>();
        for (EditorFormField editorFormField : editorFormFieldSet.getEditorFormFields()) {
            if (editorFormField.getValueConstraints() == null || editorFormField.getExtendedPropertyDefinition() == null) {
                newEditorFormFields.add(editorFormField);
                continue;
            }

            List<EditorFormFieldValueConstraint> valueConstraints = getValueConstraints(primaryNodeType, editorFormField, existingNode, parentNode, uiLocale, new HashMap<>());
            editorFormField.setValueConstraints(valueConstraints);

            newEditorFormFields.add(editorFormField);
        }

        return new EditorFormFieldSet(
            editorFormFieldSet.getName(),
            editorFormFieldSet.getDisplayName(),
            editorFormFieldSet.getDescription(),
            editorFormFieldSet.getRank(),
            editorFormFieldSet.getPriority(),
            editorFormFieldSet.getRemoved(),
            editorFormFieldSet.getDynamic(),
            editorFormFieldSet.getActivated(),
            editorFormFieldSet.getDisplayed(),
            editorFormFieldSet.getReadOnly(),
            newEditorFormFields
        );
    }

    private JCRNodeWrapper getNode(String nodeIdOrPath, JCRSessionWrapper session) throws RepositoryException {
        JCRNodeWrapper node = null;
        if (nodeIdOrPath != null) {
            if (StringUtils.startsWith(nodeIdOrPath, "/")) {
                node = session.getNode(nodeIdOrPath);
            } else {
                node = session.getNodeByIdentifier(nodeIdOrPath);
            }
        }
        return node;
    }

    private EditorFormFieldSet mergeWithStaticFormFieldSets(String nodeTypeName, EditorFormFieldSet mergedEditorFormFieldSet) {
        SortedSet<EditorFormFieldSet> staticEditorFormFieldSets = staticDefinitionsRegistry.getFormFieldSets(nodeTypeName);
        if (staticEditorFormFieldSets == null) {
            return mergedEditorFormFieldSet;
        }
        for (EditorFormFieldSet staticEditorFormFieldSet : staticEditorFormFieldSets) {
            mergedEditorFormFieldSet = mergedEditorFormFieldSet.mergeWith(staticEditorFormFieldSet);
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
        JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale locale, Locale uiLocale, Boolean removed, Boolean dynamic,
        Boolean activated, Boolean displayed, Boolean isForExtendMixin) throws RepositoryException {
        boolean isLockedAndCannotBeEdited = JCRContentUtils.isLockedAndCannotBeEdited(existingNode);
        boolean fieldSetEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:nodeTypeManagement"));


        SortedSet<EditorFormField> editorFormFields = new TreeSet<>();
        Map<String, Double> maxTargetRank = new HashMap<>();

        List<ExtendedItemDefinition> itemDefinitions = isForExtendMixin ? nodeType.getItems() : nodeType.getDeclaredItems(true);
        for (ExtendedItemDefinition itemDefinition : itemDefinitions) {
            // do not return hidden props
            if (itemDefinition.isNode() || itemDefinition.isHidden() || itemDefinition.isUnstructured() || processedProperties.contains(itemDefinition.getName())) {
                continue;
            }

            String itemType = itemDefinition.getItemType();
            Double rank = maxTargetRank.get(itemType);
            if (rank == null) {
                rank = -1.0;
            }
            rank++;
            maxTargetRank.put(itemType, rank);

            EditorFormField editorFormField = generateEditorFormField(itemDefinition, existingNode, parentNode, uiLocale, locale, rank);

            editorFormFields.add(editorFormField);
            processedProperties.add(itemDefinition.getName());
        }

        String displayName = nodeType.getLabel(uiLocale);
        String description = nodeType.getDescription(uiLocale);
        Double defaultRank = 1.0; // todo implement this properly
        Double defaultPriority = 1.0; // todo implement this properly

        return new EditorFormFieldSet(
            nodeType.getName(),
            displayName,
            description,
            defaultRank,
            defaultPriority,
            removed,
            dynamic,
            activated,
            displayed,
            !fieldSetEditable,
            editorFormFields
        );
    }

    private EditorFormField generateEditorFormField(ExtendedItemDefinition itemDefinition, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale uiLocale, Locale locale, Double rank) throws RepositoryException {
        JCRSessionWrapper session = existingNode != null ? existingNode.getSession() : getSession(locale);

        boolean isLockedAndCannotBeEdited = JCRContentUtils.isLockedAndCannotBeEdited(existingNode);
        boolean sharedFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties"));
        boolean i18nFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties_" + session.getWorkspace().getName() + "_" + locale.toString()));

        ExtendedPropertyDefinition propertyDefinition = (ExtendedPropertyDefinition) itemDefinition;

        ExtendedNodeType declaringNodeType = propertyDefinition.getDeclaringNodeType();
        EditorFormFieldTarget fieldTarget = new EditorFormFieldTarget(propertyDefinition.getItemType(), declaringNodeType.getName(), rank);
        List<EditorFormFieldValueConstraint> valueConstraints = new ArrayList<>();
        for (String valueConstraint : propertyDefinition.getValueConstraints()) {
            valueConstraints.add(new EditorFormFieldValueConstraint(valueConstraint, new EditorFormFieldValue("String", valueConstraint), null));
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
            for (Value defaultValue : propertyDefinition.getDefaultValues()) {
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
                if (existingProperty != null) {
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
            String propertyLabel = StringEscapeUtils.unescapeHtml(item.getLabel(uiLocale, extendedNodeType));
            String propertyDescription = StringEscapeUtils.unescapeHtml(item.getTooltip(uiLocale, extendedNodeType));

        String key = item.getResourceBundleKey() + ".constraint.error.message";
        if (item.getDeclaringNodeType().getTemplatePackage() != null) {
            key += "@" + item.getDeclaringNodeType().getTemplatePackage().getResourceBundleName();
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

        return new EditorFormField(
            propertyDefinition.getName(),
            propertyLabel,
            propertyDescription,
            propertyErrorMessage,
            requiredType,
            selectorType,
            selectorOptions,
            propertyDefinition.isInternationalized(),
            isFieldReadOnly(propertyDefinition, sharedFieldsEditable, i18nFieldsEditable),
            propertyDefinition.isMultiple(),
            propertyDefinition.isMandatory(),
            valueConstraints,
            defaultValues,
            currentValues,
            null,
            fieldTarget,
            propertyDefinition
        );
    }

    private List<EditorFormFieldValueConstraint> getValueConstraints(ExtendedNodeType primaryNodeType, EditorFormField editorFormField, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale uiLocale, Map<String, Object> extendContext) throws RepositoryException {
        ExtendedPropertyDefinition propertyDefinition = editorFormField.getExtendedPropertyDefinition();
        if (propertyDefinition == null) {
            logger.error("Missing property definition to resolve choice list values, cannot process");
            return Collections.emptyList();
        }

        List<EditorFormProperty> selectorOptions = editorFormField.getSelectorOptions();
        List<ChoiceListValue> initialChoiceListValues = new ArrayList<>();
        for (EditorFormFieldValueConstraint editorFormFieldValueConstraint : editorFormField.getValueConstraints()) {
            initialChoiceListValues.add(new ChoiceListValue(editorFormFieldValueConstraint.getDisplayValue(), editorFormFieldValueConstraint.getValue().getStringValue()));
        }

        if (selectorOptions != null) {
            Map<String, ChoiceListInitializer> initializers = choiceListInitializerService.getInitializers();

            Map<String, Object> context = new HashMap<>();
            context.put("contextType", primaryNodeType);
            context.put("contextNode", existingNode);
            context.put("contextParent", parentNode);
            context.putAll(extendContext);
            for (EditorFormProperty selectorProperty : selectorOptions) {
                if (initializers.containsKey(selectorProperty.getName())) {
                    initialChoiceListValues = initializers.get(selectorProperty.getName()).getChoiceListValues(propertyDefinition, selectorProperty.getValue(), initialChoiceListValues, uiLocale, context);
                }
            }
        }

        List<EditorFormFieldValueConstraint> valueConstraints = null;
        if (initialChoiceListValues != null) {
            valueConstraints = new ArrayList<>();
            for (ChoiceListValue choiceListValue : initialChoiceListValues) {
                List<EditorFormProperty> propertyList = new ArrayList<>();
                if (choiceListValue.getProperties() != null) {
                    for (Map.Entry<String, Object> choiceListPropertyEntry : choiceListValue.getProperties().entrySet()) {
                        propertyList.add(new EditorFormProperty(choiceListPropertyEntry.getKey(), choiceListPropertyEntry.getValue().toString()));
                    }
                }
                try {
                    valueConstraints.add(new EditorFormFieldValueConstraint(choiceListValue.getDisplayName(),
                        new EditorFormFieldValue(choiceListValue.getValue()),
                        propertyList
                    ));
                } catch (RepositoryException e) {
                    logger.error("Error retrieving choice list value", e);
                }
            }
        }
        return valueConstraints;
    }

    private boolean isFieldReadOnly(ExtendedPropertyDefinition propertyDefinition, boolean sharedFieldsEditable, boolean i18nFieldsEditable) {
        if (propertyDefinition.isProtected()) {
            return true;
        }

        return propertyDefinition.isInternationalized() ? !i18nFieldsEditable : !sharedFieldsEditable;
    }

    private JCRSessionWrapper getSession() throws RepositoryException {
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
    }

    private JCRSessionWrapper getSession(Locale locale) throws RepositoryException {
        if (locale == null) {
            return getSession();
        }
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale);
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
}
