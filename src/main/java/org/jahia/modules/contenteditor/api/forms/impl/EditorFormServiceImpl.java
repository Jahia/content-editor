package org.jahia.modules.contenteditor.api.forms.impl;

import org.apache.commons.lang.LocaleUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.api.Constants;
import org.jahia.modules.contenteditor.api.forms.EditorForm;
import org.jahia.modules.contenteditor.api.forms.EditorFormField;
import org.jahia.modules.contenteditor.api.forms.EditorFormService;
import org.jahia.modules.contenteditor.api.forms.EditorFormTarget;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.JCRSessionWrapper;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.services.content.nodetypes.SelectorType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class EditorFormServiceImpl implements EditorFormService {

    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    private NodeTypeRegistry nodeTypeRegistry;

    public void setNodeTypeRegistry(NodeTypeRegistry nodeTypeRegistry) {
        this.nodeTypeRegistry = nodeTypeRegistry;
    }

    @Override
    public EditorForm getEditorFormByNodeType(String nodeTypeName, String locale, String existingNodeIdentifier) {
        JCRNodeWrapper existingNode = null;
        if (existingNodeIdentifier != null) {
            try {
                if (StringUtils.startsWith(existingNodeIdentifier, "/")) {
                    getSession(locale).getNode(existingNodeIdentifier);
                } else {
                    existingNode = getSession(locale).getNodeByIdentifier(existingNodeIdentifier);
                }
            } catch (RepositoryException e) {
                logger.error("Error retrieving node by using identifier {} : {}", existingNodeIdentifier, e);
            }
        }

        try {
            Map<String,EditorFormTarget> editorFormTargets = new LinkedHashMap<>();
            ExtendedNodeType nodeType = nodeTypeRegistry.getNodeType(nodeTypeName);
            for (ExtendedPropertyDefinition propertyDefinition : nodeType.getPropertyDefinitions()) {
                String target = propertyDefinition.getItemType();
                EditorFormField editorFormField = new EditorFormField(propertyDefinition.getName(),
                        SelectorType.nameFromValue(propertyDefinition.getSelector()),
                        propertyDefinition.isInternationalized(),
                        isReadOnly(propertyDefinition, existingNode),
                        propertyDefinition.isMultiple(),
                        propertyDefinition.isMandatory(),
                        new ArrayList<>(),
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

    private boolean isReadOnly(ExtendedPropertyDefinition propertyDefinition, JCRNodeWrapper existingNode) {
        // todo there are more constraints that need to be checked in the case of a readonly property, for example if
        // we have the modify properties permission.
        // check from GWT engine : propertiesEditor.setWriteable(!engine.isExistingNode() || (PermissionsUtils.isPermitted("jcr:modifyProperties", engine.getNode()) && !engine.getNode().isLocked()));

        return existingNode != null && existingNode.isLocked() || propertyDefinition.isProtected();
    }

    private JCRSessionWrapper getSession() throws RepositoryException {
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE);
    }

    private JCRSessionWrapper getSession(String language) throws RepositoryException {
        if (language == null) {
            return getSession();
        }
        Locale locale = LocaleUtils.toLocale(language);
        return JCRSessionFactory.getInstance().getCurrentUserSession(Constants.EDIT_WORKSPACE, locale);
    }

}
