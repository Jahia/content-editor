package org.jahia.modules.contenteditor.graphql.extensions;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLTypeExtension;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrNode;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.jahia.utils.LanguageCodeConverters;

import javax.jcr.RepositoryException;

/**
 * Content Editor JCR Node extension
 */
@GraphQLTypeExtension(GqlJcrNode.class)
public class JCRNodeContentEditorExtensions {

    private GqlJcrNode node;

    public JCRNodeContentEditorExtensions(GqlJcrNode node) {
        this.node = node;
    }

    @GraphQLField
    @GraphQLDescription("Returns edit lock status of the current node object")
    public boolean isLockedAndCannotBeEdited() {
        try {
            return JCRContentUtils.isLockedAndCannotBeEdited(node.getNode());
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }
    }

    @GraphQLField
    @GraphQLName("findAvailableNodeName")
    @GraphQLDescription("Returns the next available name for a node, appending if needed numbers.")
    public String findAvailableNodeName(@GraphQLName("nodeType") String nodeTypeName, @GraphQLName("language") String language) {
        try {
            ExtendedNodeType nodeType = NodeTypeRegistry.getInstance().getNodeType(nodeTypeName);

            return JCRContentUtils.findAvailableNodeName(node.getNode(), JCRContentUtils.generateNodeName(nodeType.getLabel(
                LanguageCodeConverters.languageCodeToLocale(language))));
        } catch (RepositoryException e) {
            throw new DataFetchingException(e);
        }

    }

}
