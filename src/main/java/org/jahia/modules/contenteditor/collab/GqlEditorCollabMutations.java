package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.*;
import graphql.schema.DataFetchingEnvironment;
import graphql.servlet.GraphQLContext;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLProvider;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.content.decorator.JCRUserNode;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@GraphQLTypeExtension(DXGraphQLProvider.Mutation.class)
public class GqlEditorCollabMutations {

    @GraphQLField
    @GraphQLName("disconnectUser")
    @GraphQLDescription("Main access field to the DX GraphQL Form mutation API")
    public boolean disconnectUser(
        DataFetchingEnvironment environment,
        @GraphQLName("nodePath") @GraphQLNonNull @GraphQLDescription("Path of the node") String nodePath) throws RepositoryException {

        Optional<HttpServletRequest> httpServletRequest = ((GraphQLContext) environment.getContext()).getRequest();
        if(!httpServletRequest.isPresent()) {
            return false;
        }

        JCRSessionFactory jcrSessionFactory = JCRSessionFactory.getInstance();
        JCRUserNode userNode = jcrSessionFactory.getCurrentUserSession().getUserNode();
        String userKey = userNode.getUserKey();

        CollaborationService.disconnectUser(nodePath, userKey);
        return true;
    }
}
