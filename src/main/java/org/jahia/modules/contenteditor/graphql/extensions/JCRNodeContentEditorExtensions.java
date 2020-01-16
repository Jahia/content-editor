package org.jahia.modules.contenteditor.graphql.extensions;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLTypeExtension;
import org.jahia.modules.graphql.provider.dxm.DataFetchingException;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrNode;
import org.jahia.services.content.JCRContentUtils;

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

}
