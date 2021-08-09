package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLNonNull;
import graphql.kickstart.servlet.context.GraphQLServletContext;
import graphql.schema.DataFetchingEnvironment;
import org.jahia.modules.contenteditor.api.forms.EditorFormException;
import org.jahia.modules.contenteditor.api.lock.StaticEditorLockService;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;

/**
 * The root class for the GraphQL form mutations API
 */
public class GqlEditorFormMutations {

    /**
     * Unlock the given node for edition, if the node is locked.
     * In case the node was not locked, it's should not fail.
     *
     * @throws EditorFormException In case of any error during the unlocking
     */
    @GraphQLField
    @GraphQLDescription("Unlock the given node for edition, if the node is locked.")
    @GraphQLName("unlockEditor")
    public boolean unlockEditor(
        DataFetchingEnvironment environment,
        @GraphQLName("editorID") @GraphQLNonNull @GraphQLDescription("An ID generated client side used to identify the lock") String editorID
    ) throws EditorFormException {

        HttpServletRequest httpRequest = ((GraphQLServletContext) environment.getContext()).getHttpServletRequest();
        if (httpRequest == null) {
            return false;
        }

        try {
            StaticEditorLockService.unlock(httpRequest, editorID);
            return true;
        } catch (RepositoryException e) {
            throw new EditorFormException("Unable to unlock content editor", e);
        }
    }
}
