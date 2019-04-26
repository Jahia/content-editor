package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.modules.contenteditor.api.forms.*;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
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

import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.*;

/**
 * Implementation of the DX Content Editor Form service. This implementation supports merging with static form
 * definitions declared as JSON files inside DX modules.
 */
@Component(immediate = true)
public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    private NodeTypeRegistry nodeTypeRegistry;
    private ChoiceListInitializerService choiceListInitializerService = ChoiceListInitializerService.getInstance(); // todo we should inject this but currently DX doesn't expose it as an OSGi service.
    private StaticFormRegistry staticFormRegistry;

    @Reference
    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Reference
    public void setStaticFormRegistry(StaticFormRegistry staticFormRegistry) {
        this.staticFormRegistry = staticFormRegistry;
    }


    @Override
    public EditorForm getCreateForm(String nodeTypeName, Locale uiLocale, Locale locale, String parentPath) throws EditorFormException {
        return getEditorForm(nodeTypeName, uiLocale, locale, null, parentPath);
    }

    @Override
    public EditorForm getEditorForm(Locale uiLocale, Locale locale, String nodePath) throws EditorFormException {
        return getEditorForm(null, uiLocale, locale, nodePath, null);
    }

    private EditorForm getEditorForm(String nodeTypeName, Locale uiLocale, Locale locale, String nodePath, String parentNodePath) throws EditorFormException {
        try {

            if (nodePath == null && (parentNodePath == null || nodeTypeName == null)) {
                throw new EditorFormException("nodePath, or parentNodePath and nodetypeName, must be set.");
            }
            JCRSessionWrapper session = getSession(locale);
            JCRNodeWrapper existingNode = session.getNode(nodePath);
            if (existingNode != null) {
                nodeTypeName = existingNode.getPrimaryNodeTypeName();
            }

            JCRNodeWrapper parentNode = getParentNode(existingNode, parentNodePath, session);

            EditorForm mergedEditorForm = generateEditorFormFromNodeType(nodeTypeName, existingNode, locale);

            mergedEditorForm = mergeWithStaticForms(nodeTypeName, mergedEditorForm);
            mergedEditorForm = processValueConstraints(mergedEditorForm, locale, existingNode, parentNode);

            return mergedEditorForm;
        } catch (RepositoryException e) {
            throw new EditorFormException("Error while building edit form definition for node: " + nodePath + " and nodeType: " + nodeTypeName, e);
        }
    }

    private JCRNodeWrapper getParentNode(JCRNodeWrapper existingNode, String parentPath, JCRSessionWrapper session) throws RepositoryException {
        if (parentPath == null) {
           return  existingNode.getParent();
        }
        return session.getNode(parentPath);
    }

    private EditorForm processValueConstraints(EditorForm editForm, Locale uiLocale, JCRNodeWrapper existingNode, JCRNodeWrapper parentNode) throws RepositoryException {
        List<EditorFormField> newEditorFormFields = new ArrayList<>();
        ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(editForm.getNodeType());
        Map<String, ChoiceListInitializer> initializers = choiceListInitializerService.getInitializers();
        for (EditorFormField editorFormField : editForm.getEditorFormFields()) {
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
                    editorFormField.getSelectorType(),
                    editorFormField.getSelectorOptions(),
                    editorFormField.getI18n(),
                    editorFormField.getReadOnly(),
                    editorFormField.getMultiple(),
                    editorFormField.getMandatory(),
                    valueConstraints,
                    editorFormField.getDefaultValues(),
                    editorFormField.isRemoved(),
                    editorFormField.getTargets(),
                    editorFormField.getExtendedPropertyDefinition()));
        }
        return new EditorForm(editForm.getNodeType(), newEditorFormFields);
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

    private EditorForm mergeWithStaticForms(String nodeTypeName, EditorForm mergedEditorForm) {
        SortedSet<EditorForm> staticEditorForms = staticFormRegistry.getForm(nodeTypeName);
        if (staticEditorForms == null) {
            return mergedEditorForm;
        }
        for (EditorForm staticEditorForm : staticEditorForms) {
            mergedEditorForm = mergedEditorForm.mergeWith(staticEditorForm);
        }
        return mergedEditorForm;
    }

    private EditorForm generateEditorFormFromNodeType(String nodeTypeName, JCRNodeWrapper existingNode, Locale locale) throws RepositoryException {
        JCRSessionWrapper session = existingNode != null ? existingNode.getSession() : getSession(locale);
        ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(nodeTypeName);
        Map<String,Double> maxTargetRank = new HashMap<>();
        List<EditorFormField> editorFormFields = new ArrayList<>();

        boolean sharedFieldsEditable = existingNode == null || (!existingNode.isLocked() && existingNode.hasPermission("jcr:modifyProperties"));
        boolean i18nFieldsEditable = existingNode == null || (!existingNode.isLocked() && existingNode.hasPermission("jcr:modifyProperties_" + session.getWorkspace().getName() + "_" + locale.toString()));

        for (ExtendedPropertyDefinition propertyDefinition : nodeType.getPropertyDefinitions()) {

            // do not return hidden props
            if (propertyDefinition.isHidden()) {
                continue;
            }

            String target = propertyDefinition.getItemType();
            Double rank = maxTargetRank.get(target);
            if (rank == null) {
                rank = -1.0;
            }
            rank++;
            List<EditorFormFieldTarget> fieldTargets = new ArrayList<>();
            fieldTargets.add(new EditorFormFieldTarget(target, rank));
            maxTargetRank.put(target, rank);
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
            EditorFormField editorFormField = new EditorFormField(propertyDefinition.getName(),
                    SelectorType.nameFromValue(propertyDefinition.getSelector()),
                    selectorOptions,
                    propertyDefinition.isInternationalized(),
                    isFieldReadOnly(propertyDefinition, sharedFieldsEditable, i18nFieldsEditable),
                    propertyDefinition.isMultiple(),
                    propertyDefinition.isMandatory(),
                    valueConstraints,
                    defaultValues,
                    null,
                    fieldTargets,
                    propertyDefinition);
            editorFormFields.add(editorFormField);
        }
        return new EditorForm(nodeTypeName, editorFormFields);
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


}
