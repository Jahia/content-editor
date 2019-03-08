package org.jahia.modules.contenteditor.api.forms.impl;

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

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    private NodeTypeRegistry nodeTypeRegistry;

    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Override
    public EditorForm getEditorFormByNodeType(String nodeTypeName) {
        try {
            Map<String,EditorFormTarget> editorFormTargets = new LinkedHashMap<>();
            ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(nodeTypeName);
            for (ExtendedPropertyDefinition propertyDefinition : nodeType.getPropertyDefinitions()) {
                String target = propertyDefinition.getItemType();
                EditorFormField editorFormField = new EditorFormField(propertyDefinition.getName(),
                        SelectorType.nameFromValue(propertyDefinition.getSelector()),
                        propertyDefinition.isInternationalized(),
                        false,
                        propertyDefinition.isMultiple(),
                        new ArrayList<String>(),
                        null);
                EditorFormTarget editorFormTarget = editorFormTargets.get(target);
                if (editorFormTarget == null) {
                    editorFormTarget = new EditorFormTarget(target);
                }
                editorFormTarget.addField(editorFormField);
                editorFormTargets.put(target, editorFormTarget);
            }
            // todo implement overrides
            // todo implement choicelist initializer calls
            // todo implement constraints (read-only, etc...)
            return new EditorForm(nodeType.getName(), editorFormTargets.values());
        } catch (NoSuchNodeTypeException e) {
            logger.error("Error looking up node type using name " + nodeTypeName, e);
        }
        return null;
    }
}
