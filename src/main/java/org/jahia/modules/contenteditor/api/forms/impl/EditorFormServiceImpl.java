package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.modules.contenteditor.api.forms.*;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.services.content.nodetypes.SelectorType;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializer;
import org.jahia.services.content.nodetypes.initializers.ChoiceListInitializerService;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;

/**
 * Implementation of the DX Content Editor Form service. This implementation supports merging with static form
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
    public EditorForm getCreateForm(String primaryNodeTypeName, Locale uiLocale, Locale locale, String parentPath) throws EditorFormException {
        return getEditorForm(primaryNodeTypeName, uiLocale, locale, null, parentPath);
    }

    @Override
    public EditorForm getEditForm(Locale uiLocale, Locale locale, String nodePath) throws EditorFormException {
        return getEditorForm(null, uiLocale, locale, nodePath, null);
    }

    private EditorForm getEditorForm(String primaryNodeTypeName, Locale uiLocale, Locale locale, String nodePath, String parentNodePath) throws EditorFormException {
        try {

            if (nodePath == null && (parentNodePath == null || primaryNodeTypeName == null)) {
                throw new EditorFormException("nodePath, or parentNodePath and nodetypeName, must be set.");
            }
            JCRSessionWrapper session = getSession(locale);
            JCRNodeWrapper existingNode = null;
            if (nodePath != null) {
                existingNode = session.getNode(nodePath);
                if (existingNode != null) {
                    primaryNodeTypeName = existingNode.getPrimaryNodeTypeName();
                }
            }
            JCRNodeWrapper parentNode = getParentNode(existingNode, parentNodePath, session);
            ExtendedNodeType primaryNodeType = nodeTypeRegistry.getNodeType(primaryNodeTypeName);

            SortedSet<EditorFormDefinition> editorFormDefinitions = staticDefinitionsRegistry.getFormDefinitions(primaryNodeTypeName);
            if (editorFormDefinitions == null) {
                editorFormDefinitions = staticDefinitionsRegistry.getFormDefinitions(DEFAULT_FORM_DEFINITION_NAME);
            }
            if (editorFormDefinitions == null) {
                logger.error("Couldn't find any form definitions, even default is missing !");
                return null;
            }
            EditorFormDefinition mergedFormDefinition = mergeFormDefinitions(editorFormDefinitions);

            Map<String, EditorFormSection> formSectionsByName = new HashMap<>();

            Set<String> processedNodeTypes = new HashSet<>();
            generateAndMergeFieldSetForType(primaryNodeTypeName, uiLocale, locale, existingNode, parentNode, primaryNodeType, formSectionsByName, false, true);
            processedNodeTypes.add(primaryNodeTypeName);

            for (ExtendedNodeType superType : primaryNodeType.getSupertypes()) {
                generateAndMergeFieldSetForType(superType.getName(), uiLocale, locale, existingNode, parentNode, superType, formSectionsByName, false, true);
                processedNodeTypes.add(superType.getName());
            }

            List<ExtendedNodeType> extendMixins = getExtendMixins(primaryNodeTypeName, parentNode.getResolveSite());
            for (ExtendedNodeType extendMixinNodeType : extendMixins) {
                if (processedNodeTypes.contains(extendMixinNodeType.getName())) {
                    // ignore already process node types
                    continue;
                }
                Boolean activated = false;
                if (existingNode != null && existingNode.isNodeType(extendMixinNodeType.getName())) {
                    activated = true;
                }
                generateAndMergeFieldSetForType(extendMixinNodeType.getName(), uiLocale, locale, existingNode, parentNode, extendMixinNodeType, formSectionsByName, true, activated);
                processedNodeTypes.add(extendMixinNodeType.getName());
            }

            List<EditorFormSection> sortedSections = sortSections(formSectionsByName, mergedFormDefinition);

            String formName = primaryNodeTypeName;
            String formDisplayName = primaryNodeType.getLabel(uiLocale);
            String formDescription = primaryNodeType.getDescription(uiLocale);
            EditorForm editorForm = new EditorForm(formName, formDisplayName, formDescription, sortedSections);

            return editorForm;
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + nodePath + " and nodeType: " + primaryNodeTypeName, e);
        }
    }

    private void generateAndMergeFieldSetForType(String nodeTypeName, Locale uiLocale, Locale locale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode, ExtendedNodeType primaryNodeType, Map<String, EditorFormSection> formSectionsByName, boolean dynamic, boolean activated) throws RepositoryException {
        EditorFormFieldSet nodeTypeFieldSet = generateEditorFormFieldSet(primaryNodeType, existingNode, locale, uiLocale, dynamic, activated);
        nodeTypeFieldSet = mergeWithStaticFormFieldSets(nodeTypeName, nodeTypeFieldSet);
        nodeTypeFieldSet = processValueConstraints(nodeTypeFieldSet, locale, existingNode, parentNode);
        addFieldSetToSections(formSectionsByName, nodeTypeFieldSet);
    }

    private EditorFormDefinition mergeFormDefinitions(SortedSet<EditorFormDefinition> editorFormDefinitions) {
        EditorFormDefinition mergedEditorFormDefinition = null;
        for (EditorFormDefinition editorFormDefinition : editorFormDefinitions) {
            if (mergedEditorFormDefinition == null) {
                mergedEditorFormDefinition = editorFormDefinition;
            } else {
                mergedEditorFormDefinition = mergedEditorFormDefinition.mergeWith(editorFormDefinition);
            }
        }
        return mergedEditorFormDefinition;
    }

    private List<EditorFormSection> sortSections(Map<String, EditorFormSection> formSectionsByName, EditorFormDefinition editorFormDefinition) {
        List<EditorFormSection> sortedFormSections = new ArrayList<>();
        for (EditorFormSectionDefinition sectionDefinition : editorFormDefinition.getSections()) {
            EditorFormSection formSection = formSectionsByName.get(sectionDefinition.getName());
            if (formSection != null) {
                Collections.sort(formSection.getFieldSets());
                sortedFormSections.add(formSection);
            }
        }
        return sortedFormSections;
    }

    private void addFieldSetToSections(Map<String, EditorFormSection> formSectionsByName, EditorFormFieldSet formFieldSet) {
        String targetSectionName = resolveMainSectionName(formFieldSet);
        EditorFormSection targetSection = formSectionsByName.get(targetSectionName);
        if (targetSection == null) {
            String targetSectionDisplayName = targetSectionName; // todo resolve proper display name from resource bundles
            String targetSectionDescription = ""; // todo resolve proper description from resource bundles
            Double targetSectionRank = 1.0;
            Double targetSectionPriority = 1.0;
            targetSection = new EditorFormSection(targetSectionName, targetSectionDisplayName, targetSectionDescription, targetSectionRank, targetSectionPriority, new ArrayList<>());
        }
        formFieldSet.setRank((double) targetSection.getFieldSets().size() + 1);
        if (!formFieldSet.getDynamic() && formFieldSet.getEditorFormFields().size() == 0) {
            // in the case of an empty static mixin or parent type we don't add it to the form
            return;
        }
        targetSection.getFieldSets().add(formFieldSet);
        formSectionsByName.put(targetSection.getName(), targetSection);
    }

    private String resolveMainSectionName(EditorFormFieldSet extendMixinFieldSet) {
        String targetSectionName = null;
        for (EditorFormField field : extendMixinFieldSet.getEditorFormFields()) {
            // let's check what target they have in case we have to move them.
            if (targetSectionName == null) {
                targetSectionName = field.getTarget().getSectionName();
            } else if (!targetSectionName.equals(field.getTarget().getSectionName())) {
                // field should be moved to another section, but in which field set ?
                // todo to be implemented
            }
        }
        if (targetSectionName == null) {
            targetSectionName = "content";
        }
        return targetSectionName;
    }

    private JCRNodeWrapper getParentNode(JCRNodeWrapper existingNode, String parentPath, JCRSessionWrapper session) throws RepositoryException {
        if (parentPath == null) {
           return  existingNode.getParent();
        }
        return session.getNode(parentPath);
    }

    private EditorFormFieldSet processValueConstraints(EditorFormFieldSet editorFormFieldSet, Locale uiLocale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode) throws RepositoryException {
        List<EditorFormField> newEditorFormFields = new ArrayList<>();
        ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(editorFormFieldSet.getName());
        Map<String, ChoiceListInitializer> initializers = choiceListInitializerService.getInitializers();
        for (EditorFormField editorFormField : editorFormFieldSet.getEditorFormFields()) {
            if (editorFormField.getValueConstraints() == null || editorFormField.getExtendedPropertyDefinition() == null) {
                newEditorFormFields.add(editorFormField);
                continue;
            }
            List<ChoiceListValue> initialChoiceListValues = new ArrayList<>();
            for (EditorFormFieldValueConstraint editorFormFieldValueConstraint : editorFormField.getValueConstraints()) {
                initialChoiceListValues.add(new ChoiceListValue(editorFormFieldValueConstraint.getDisplayValue(), editorFormFieldValueConstraint.getValue().getStringValue()));
            }
            List<EditorFormFieldValueConstraint> valueConstraints = getValueConstraints(initialChoiceListValues, editorFormField.getSelectorOptions(),
                    existingNode, parentNode, uiLocale, nodeType, initializers, editorFormField.getExtendedPropertyDefinition());
            newEditorFormFields.add(new EditorFormField(editorFormField.getName(),
                editorFormField.getDisplayName(),
                editorFormField.getDescription(),
                editorFormField.getRequiredType(),
                    editorFormField.getSelectorType(),
                    editorFormField.getSelectorOptions(),
                    editorFormField.getI18n(),
                    editorFormField.getReadOnly(),
                    editorFormField.getMultiple(),
                    editorFormField.getMandatory(),
                    valueConstraints,
                    editorFormField.getDefaultValues(),
                editorFormField.getCurrentValues(),
                    editorFormField.isRemoved(),
                editorFormField.getTarget(),
                    editorFormField.getExtendedPropertyDefinition()));
        }
        return new EditorFormFieldSet(editorFormFieldSet.getName(),
            editorFormFieldSet.getDisplayName(),
            editorFormFieldSet.getDescription(),
            editorFormFieldSet.getRank(),
            editorFormFieldSet.getPriority(),
            editorFormFieldSet.getDynamic(),
            editorFormFieldSet.getActivated(),
            newEditorFormFields);
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

    private EditorFormFieldSet generateEditorFormFieldSet(ExtendedNodeType nodeType, JCRNodeWrapper existingNode, Locale locale, Locale uiLocale, Boolean dynamic, Boolean activated) throws RepositoryException {
        JCRSessionWrapper session = existingNode != null ? existingNode.getSession() : getSession(locale);
        Map<String,Double> maxTargetRank = new HashMap<>();
        List<EditorFormField> editorFormFields = new ArrayList<>();

        boolean sharedFieldsEditable = existingNode == null || (!existingNode.isLocked() && existingNode.hasPermission("jcr:modifyProperties"));
        boolean i18nFieldsEditable = existingNode == null || (!existingNode.isLocked() && existingNode.hasPermission("jcr:modifyProperties_" + session.getWorkspace().getName() + "_" + locale.toString()));

        for (ExtendedPropertyDefinition propertyDefinition : nodeType.getDeclaredPropertyDefinitions()) {

            // do not return hidden props
            if (propertyDefinition.isHidden()) {
                continue;
            }

            String itemType = propertyDefinition.getItemType();
            Double rank = maxTargetRank.get(itemType);
            if (rank == null) {
                rank = -1.0;
            }
            rank++;

            ExtendedNodeType declaringNodeType = propertyDefinition.getDeclaringNodeType();
            EditorFormFieldTarget fieldTarget = new EditorFormFieldTarget(itemType, declaringNodeType.getName(), rank);
            maxTargetRank.put(itemType, rank);
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
            String aliasPropertyLabel = extendedNodeType.getPropertyDefinition(propertyDefinition.getName()).getLabel(uiLocale);
            String propertyLabel = propertyDefinition.getLabel(uiLocale);
            String propertyDescription = propertyDefinition.getTooltip(uiLocale, extendedNodeType);
            if (!propertyLabel.equals(aliasPropertyLabel)) {
                // we do this check because the old code was accessing the node type using the alias, so we prefer to
                // be 100% compatible for the moment but we should get rid of this if there is no real reason to use
                // the alias.
                logger.warn("Alias label and regular label are not equal !");
                propertyLabel = aliasPropertyLabel;
            }
            String selectorType = SelectorType.nameFromValue(propertyDefinition.getSelector());
            if (selectorType == null) {
                // selector type was not found in the list of selector types in the core, let's try our more expanded one
                if (defaultSelectors.containsKey(propertyDefinition.getRequiredType())) {
                    selectorType = SelectorType.nameFromValue(defaultSelectors.get(propertyDefinition.getRequiredType()));
                } else {
                    logger.warn("Couldn't resolve a default selector type for property " + propertyDefinition.getName());
                }
            }
            String requiredType = PropertyType.nameFromValue(propertyDefinition.getRequiredType());
            EditorFormField editorFormField = new EditorFormField(propertyDefinition.getName(),
                propertyLabel,
                propertyDescription,
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
                    propertyDefinition);
            editorFormFields.add(editorFormField);
        }
        String displayName = nodeType.getLabel(uiLocale);
        String description = nodeType.getDescription(uiLocale);
        Double defaultRank = 1.0; // todo implement this properly
        Double defaultPriority = 1.0; // todo implement this properly
        return new EditorFormFieldSet(nodeType.getName(),
            displayName,
            description,
            defaultRank,
            defaultPriority,
            dynamic,
            activated,
            editorFormFields);
    }

    private List<EditorFormFieldValueConstraint> getValueConstraints(List<ChoiceListValue> listValues,
                                                                     List<EditorFormProperty> selectorOptions,
                                                                     JCRNodeWrapper existingNode,
                                                                     JCRNodeWrapper parentNode,
                                                                     Locale uiLocale,
                                                                     ExtendedNodeType nodeType,
                                                                     Map<String, ChoiceListInitializer> initializers,
                                                                     ExtendedPropertyDefinition propertyDefinition) {

        if (propertyDefinition == null) {
            logger.error("Missing property definition to resolve choice list values, cannot process");
            return null;
        }

        // let's retrieve choicelist initializer values
        if (selectorOptions != null) {
            Map<String, Object> context = new HashMap<>();
            context.put("contextType", nodeType);
            context.put("contextNode", existingNode);
            context.put("contextParent", parentNode);
            for (EditorFormProperty selectorProperty : selectorOptions) {
                if (initializers.containsKey(selectorProperty.getName())) {
                    listValues = initializers.get(selectorProperty.getName()).getChoiceListValues(propertyDefinition, selectorProperty.getValue(),
                            listValues, uiLocale, context);
                }
            }
        }

        List<EditorFormFieldValueConstraint> valueConstraints = null;
        if (listValues != null) {
            valueConstraints = new ArrayList<>();
            for (ChoiceListValue choiceListValue : listValues) {
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
