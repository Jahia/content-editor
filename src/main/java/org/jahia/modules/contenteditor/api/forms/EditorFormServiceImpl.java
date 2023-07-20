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
package org.jahia.modules.contenteditor.api.forms;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.api.templates.JahiaTemplateManagerService;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.modules.contenteditor.api.forms.model.*;
import org.jahia.modules.contenteditor.graphql.api.types.ContextEntryInput;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.*;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.*;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializer;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializerService;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.utils.i18n.Messages;
import org.osgi.framework.Bundle;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.touk.throwing.ThrowingFunction;

import javax.jcr.RepositoryException;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;
import java.util.stream.Collectors;

import static org.jahia.modules.contenteditor.utils.ContentEditorUtils.resolveNodeFromPathorUUID;

/**
 * Implementation of the Jahia Content Editor Form service. This implementation supports merging with static form
 * definitions declared as JSON files inside DX modules.
 */
@Component(immediate = true)
public class EditorFormServiceImpl implements EditorFormService {
    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);

    private static final String EDIT = "edit";
    private static final String CREATE = "create";

    private NodeTypeRegistry nodeTypeRegistry;
    private ChoiceListInitializerService choiceListInitializerService;
    private StaticDefinitionsRegistry staticDefinitionsRegistry;
    private JahiaTemplateManagerService jahiaTemplateManagerService;

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

    @Override
    public Form getCreateForm(String primaryNodeTypeName, String uuidOrPath, Locale uiLocale, Locale locale) throws EditorFormException {
        try {
            return getEditorForm(nodeTypeRegistry.getNodeType(primaryNodeTypeName), null, resolveNodeFromPathorUUID(uuidOrPath, locale), uiLocale, locale);
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building create form definition for node: " + uuidOrPath + " and nodeType: " + primaryNodeTypeName, e);
        }
    }

    @Override
    public Form getEditForm(String uuidOrPath, Locale uiLocale, Locale locale) throws EditorFormException {
        try {
            JCRNodeWrapper node = resolveNodeFromPathorUUID(uuidOrPath, locale);
            return getEditorForm(node.getPrimaryNodeType(), node, node.getParent(), uiLocale, locale);
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + uuidOrPath, e);
        }
    }

    private Form getEditorForm(ExtendedNodeType primaryNodeType, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale uiLocale, Locale locale) throws EditorFormException {
        final String mode = existingNode == null ? CREATE : EDIT;
        final JCRNodeWrapper currentNode = EDIT.equals(mode) ? existingNode : parentNode;

        try {
            final JCRSiteNode site = currentNode.getResolveSite();

            // Gather all nodetypes and get associated forms
            Set<String> processedNodeTypes = new HashSet<>();
            final SortedSet<DefinitionRegistryItem> mergeSet = new TreeSet<>(DefinitionRegistryItemComparator.INSTANCE);

            // First, primary node type and inherited
            addFormNodeType(primaryNodeType, mergeSet, locale, false, processedNodeTypes);

            // Available extends mixins
            List<ExtendedNodeType> extendMixins = getExtendMixins(primaryNodeType, site);
            for (ExtendedNodeType extendMixin : extendMixins) {
                addFormNodeType(extendMixin, mergeSet, locale, true, processedNodeTypes);
            }

            // Mixins added on node
            if (existingNode != null) {
                for (ExtendedNodeType mixinNodeType : existingNode.getMixinNodeTypes()) {
                    addFormNodeType(mixinNodeType, mergeSet, locale, false, processedNodeTypes);
                }
            }

            // Merge all forms into a new form
            Form form = new Form();
            for (DefinitionRegistryItem current : mergeSet) {
                if (current.getOriginBundle() == null || isApplicable(current.getOriginBundle(), site)) {
                    form.mergeWith(current);
                }
            }

            // Post process on sections / fieldSets / fields
            JCRSessionWrapper session = existingNode != null ? existingNode.getSession() : parentNode.getSession();
            boolean isLockedAndCannotBeEdited = JCRContentUtils.isLockedAndCannotBeEdited(existingNode);
            boolean fieldSetEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:nodeTypeManagement"));
            boolean sharedFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties"));
            boolean i18nFieldsEditable = existingNode == null || (!isLockedAndCannotBeEdited && existingNode.hasPermission("jcr:modifyProperties_" + session.getWorkspace().getName() + "_" + locale.toString()));

            form.setLabel(form.getLabel() == null && form.getLabelKey() != null ? resolveResourceKey(form.getLabelKey(), uiLocale, site) : form.getLabel());
            form.setDescription(form.getDescription() == null && form.getDescriptionKey() != null ? resolveResourceKey(form.getDescriptionKey(), uiLocale, site) : form.getDescription());
            form.initializeLabel(uiLocale);
            form.getSections().sort(RankedComparator.INSTANCE);

            // Keep track of the list of all fieldSets per nodetype
            Map<String, Collection<FieldSet>> fieldSetsMap = form.getSections().stream()
                .flatMap(s -> s.getFieldSets().stream())
                .collect(Collectors.<FieldSet, String, Collection<FieldSet>>toMap(FieldSet::getName, Collections::singleton, CollectionUtils::union));

            for (Section section : form.getSections()) {
                // Set section label and description if not set
                section.initializeLabel(uiLocale, site);
                section.setVisible((section.isHide() == null || !section.isHide()) &&
                    (section.getRequiredPermission() == null || currentNode.hasPermission(section.getRequiredPermission())) &&
                    (section.getDisplayModes() == null || section.getDisplayModes().contains(mode)));
                section.getFieldSets().sort(RankedComparator.INSTANCE);

                for (FieldSet fieldSet : section.getFieldSets()) {
                    // Set fieldSet label and description if not set
                    fieldSet.initializeLabel(uiLocale, site);
                    fieldSet.setVisible((fieldSet.isHide() == null || !fieldSet.isHide()) &&
                        (fieldSet.getRequiredPermission() == null || currentNode.hasPermission(fieldSet.getRequiredPermission())));
                    fieldSet.getFields().sort(RankedComparator.INSTANCE);

                    // Check if fieldset is dynamic
                    if (fieldSet.getNodeType() != null) {
                        ExtendedNodeType nodeType = fieldSet.getNodeType();
                        boolean isExtend = !nodeType.getMixinExtends().isEmpty() && !primaryNodeType.isNodeType(nodeType.getName());
                        if (isExtend) {
                            fieldSet.setDynamic(true);
                            fieldSet.setActivated(existingNode != null && existingNode.isNodeType(fieldSet.getName()));
                            fieldSet.setHasEnableSwitch(!nodeType.isNodeType("jmix:templateMixin"));

                            // Update readonly if user does not have permission to add/remove mixin
                            fieldSet.setReadOnly((fieldSet.isReadOnly() != null && fieldSet.isReadOnly()) || !fieldSetEditable);
                        }
                    }

                    for (Field field : fieldSet.getFields()) {
                        // Set field label and description if not set
                        field.initializeLabel(uiLocale, site, primaryNodeType);
                        field.setVisible(field.isHide() == null || !field.isHide());

                        // Update readonly if user does not have permission to edit
                        boolean forceReadOnly = field.getExtendedPropertyDefinition() != null && field.getExtendedPropertyDefinition().isInternationalized() ? !i18nFieldsEditable : !sharedFieldsEditable;
                        field.setReadOnly((field.isReadOnly() != null && field.isReadOnly()) || forceReadOnly);

                        if (field.getValueConstraints() != null && field.getExtendedPropertyDefinition() != null) {
                            List<FieldValueConstraint> valueConstraints = getValueConstraints(primaryNodeType, field, existingNode, parentNode, locale, new HashMap<>());
                            if (valueConstraints != null && !valueConstraints.isEmpty()) {
                                field.setValueConstraints(valueConstraints);
                            }
                        }
                    }

                    fieldSet.setVisible(fieldSet.isVisible() && (fieldSet.isHasEnableSwitch() || fieldSet.getFields().stream().anyMatch(Field::isVisible)));
                }

                // Remove empty fieldSets - only keep empty dynamic field set which do not have matching mixin in another section
                // (if the dynamic mixin is present in multiple sections, keep only the non-empty ones)
                section.setFieldSets(section.getFieldSets().stream()
                    .filter(fs -> (fs.isDynamic() && fieldSetsMap.get(fs.getName()).size() == 1) || !fs.getFields().isEmpty())
                    .collect(Collectors.toList()));

                section.setVisible(section.isVisible() && section.getFieldSets().stream().anyMatch(FieldSet::isVisible));
            }

            // Remove empty sections
            form.setSections(form.getSections().stream()
                .filter(s -> !s.getFieldSets().isEmpty())
                .collect(Collectors.toList()));

            return form;
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + currentNode.getPath() + " and nodeType: " + primaryNodeType.getName(), e);
        }
    }

    private void addFormNodeType(ExtendedNodeType nodeType, SortedSet<DefinitionRegistryItem> formDefinitionsToMerge, Locale locale, boolean singleFieldSet, Set<String> processedNodeTypes) throws RepositoryException {
        if (!processedNodeTypes.contains(nodeType.getName())) {
            formDefinitionsToMerge.add(FormGenerator.generateForm(nodeType, locale, singleFieldSet));
            formDefinitionsToMerge.addAll(staticDefinitionsRegistry.getFormsForType(nodeType));
            formDefinitionsToMerge.addAll(staticDefinitionsRegistry.getFieldSetsForType(nodeType));

            processedNodeTypes.add(nodeType.getName());
            processedNodeTypes.addAll(nodeType.getSupertypeSet().stream().map(ExtendedNodeType::getName).collect(Collectors.toList()));
        }
    }

    public static String resolveResourceKey(String key, Locale locale, JCRSiteNode site) {
        // Copied from org.jahia.ajax.gwt.helper.UIConfigHelper.getResources
        // Todo: BACKLOG-10823 - avoid code duplication and use a static shared utility function
        if (key == null || key.length() == 0) {
            return key;
        }
        logger.debug("Resources key: {}", key);
        String baseName = null;
        String value;
        if (key.contains("@")) {
            if (key.contains("resources.")) {
                baseName = StringUtils.substringAfter(key, "@");
                key = StringUtils.substringBefore(key, "@");
            } else {
                baseName = StringUtils.substringBefore(key, "@");
                key = StringUtils.substringAfter(key, "@");
            }
        }

        value = Messages.get(baseName, site != null ? site.getTemplatePackage() : null, key, locale, StringUtils.EMPTY);
        if (StringUtils.isEmpty(value) && baseName != null) {
            JahiaTemplatesPackage jahiaTemplatesPackage = ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageRegistry().lookupById(baseName);
            value = Messages.get(baseName, jahiaTemplatesPackage, key, locale, StringUtils.EMPTY);
        } else if (value == null) {
            value = Messages.getInternal(key, locale);
        }
        return value;
    }

    private List<FieldValueConstraint> getValueConstraints(ExtendedNodeType primaryNodeType, Field editorFormField, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, Locale locale, Map<String, Object> extendContext) throws RepositoryException {
        ExtendedPropertyDefinition propertyDefinition = editorFormField.getExtendedPropertyDefinition();
        if (propertyDefinition == null) {
            logger.error("Missing property definition to resolve choice list values, cannot process");
            return Collections.emptyList();
        }

        Map<String, Object> selectorOptions = editorFormField.getSelectorOptionsMap();
        List<ChoiceListValue> initialChoiceListValues = new ArrayList<>();

        if (selectorOptions != null && !selectorOptions.isEmpty()) {
            Map<String, ChoiceListInitializer> initializers = choiceListInitializerService.getInitializers();

            Map<String, Object> context = new HashMap<>();
            context.put("contextType", primaryNodeType);
            context.put("contextNode", existingNode);
            context.put("contextParent", parentNode);
            context.putAll(extendContext);
            for (Map.Entry<String, Object> entry : selectorOptions.entrySet()) {
                if (initializers.containsKey(entry.getKey())) {
                    initialChoiceListValues = initializers.get(entry.getKey()).getChoiceListValues(propertyDefinition, (String) entry.getValue(), initialChoiceListValues, locale, context);
                }
            }
            List<FieldValueConstraint> valueConstraints = null;
            if (initialChoiceListValues != null) {
                valueConstraints = new ArrayList<>();
                for (ChoiceListValue choiceListValue : initialChoiceListValues) {
                    FieldValueConstraint cst = new FieldValueConstraint();
                    cst.setDisplayValue(choiceListValue.getDisplayName());
                    cst.setValue(FieldValue.convert(choiceListValue.getValue()));
                    cst.setPropertyList(choiceListValue.getProperties() != null ?
                        choiceListValue.getProperties().entrySet().stream().map(e -> new Property(e.getKey(), e.getValue().toString())).collect(Collectors.toList()) :
                        Collections.emptyList()
                    );
                    valueConstraints.add(cst);
                }
            }
            return valueConstraints;
        } else {
            return editorFormField.getValueConstraints();
        }
    }

    private List<ExtendedNodeType> getExtendMixins(ExtendedNodeType type, JCRSiteNode site) throws NoSuchNodeTypeException {
        ArrayList<ExtendedNodeType> res = new ArrayList<>();

        Set<String> installedModules = site != null && site.getPath().startsWith("/sites/") ? site.getInstalledModulesWithAllDependencies() : null;

        Map<ExtendedNodeType, Set<ExtendedNodeType>> m = NodeTypeRegistry.getInstance().getMixinExtensions();

        for (ExtendedNodeType nodeType : m.keySet()) {
            if (type.isNodeType(nodeType.getName())) {
                for (ExtendedNodeType extension : m.get(nodeType)) {
//                        ctx.put("contextType", realType);
                    if (installedModules == null || extension.getTemplatePackage() == null || extension.getTemplatePackage().getModuleType().equalsIgnoreCase("system") || installedModules.contains(extension.getTemplatePackage().getId())) {
                        res.add(extension);
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

    @Override
    public List<FieldValueConstraint> getFieldConstraints(String nodeUuidOrPath, String parentNodeUuidOrPath, String primaryNodeType, String fieldNodeType, String fieldName, List<ContextEntryInput> context, Locale uiLocale, Locale locale) throws EditorFormException {
        try {
            JCRNodeWrapper node = nodeUuidOrPath != null ? resolveNodeFromPathorUUID(nodeUuidOrPath, locale) : null;
            JCRNodeWrapper parentNode = resolveNodeFromPathorUUID(parentNodeUuidOrPath, locale);
            ExtendedNodeType nodeType = NodeTypeRegistry.getInstance().getNodeType(primaryNodeType);

            Map<String, Object> extendContext = new HashMap<>();
            for (ContextEntryInput contextEntry : context) {
                if (contextEntry.getValue() != null) {
                    extendContext.put(contextEntry.getKey(), contextEntry.getValue());
                }
            }

            Form f = getEditorForm(nodeType, node, parentNode, uiLocale, locale);
            return f.getSections().stream()
                .flatMap(section -> section.getFieldSets().stream())
                .flatMap(fieldSet -> fieldSet.getFields().stream())
                .filter(field -> (fieldNodeType.equals(field.getDeclaringNodeType()) || primaryNodeType.equals(field.getDeclaringNodeType())) && fieldName.equals(field.getName()))
                .findFirst()
                .map(ThrowingFunction.unchecked(field -> getValueConstraints(nodeType, field, node, parentNode, locale, extendContext)))
                .orElse(Collections.emptyList());
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building field constraints for" + " node: " + nodeUuidOrPath + ", node type: " + primaryNodeType + ", parent node: " + parentNodeUuidOrPath + ", field node type: " + fieldNodeType + ", field name: " + fieldName, e);
        }
    }

}
