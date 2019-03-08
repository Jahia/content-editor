package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.jackrabbit.spi.commons.nodetype.constraint.ValueConstraint;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormField;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.api.forms.EditorFormTarget;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.services.content.nodetypes.SelectorType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.List;

public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    private NodeTypeRegistry nodeTypeRegistry;

    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Override
    public EditorForm getEditorFormByNodeType(String nodeTypeName) {
        try {
            ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(nodeTypeName);
            List<EditorFormField> editorFormFields = new ArrayList<>();
            for (ExtendedPropertyDefinition propertyDefinition : nodeType.getPropertyDefinitions()) {
                EditorFormField editorFormField = new EditorFormField(propertyDefinition.getName(),
                        SelectorType.nameFromValue(propertyDefinition.getSelector()),
                        propertyDefinition.isInternationalized(),
                        propertyDefinition.isMultiple(),
                        false,
                        new ArrayList<String>(),
                        null);
                editorFormFields.add(editorFormField);
            }
            // todo define mapping from mixins to targets
            List<EditorFormTarget> editorFormTargets = new ArrayList<>();
            EditorFormTarget contentEditorFormTarget = new EditorFormTarget("content", editorFormFields);
            editorFormTargets.add(contentEditorFormTarget);
            // todo implement overrides
            // todo implement choicelist initializer calls
            // todo implement constraints (read-only, etc...)
            return new EditorForm(nodeType.getName(), editorFormTargets);
        } catch (NoSuchNodeTypeException e) {
            logger.error("Error looking up node type using name " + nodeTypeName, e);
        }
        return null;
    }
}
