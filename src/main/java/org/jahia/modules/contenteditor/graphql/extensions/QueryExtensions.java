package org.jahia.modules.contenteditor.graphql.extensions;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLTypeExtension;
import org.jahia.modules.contenteditor.graphql.api.GqlEditorForms;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLProvider;

/**
 * This extension to the Query is where the content editor GraphQL form API is made available
 */
@GraphQLTypeExtension(DXGraphQLProvider.Query.class)
public class QueryExtensions {

    @GraphQLField
    @GraphQLName("forms")
    @GraphQLDescription("Main access field to the DX GraphQL Form API")
    public static GqlEditorForms getForms() {
        return new GqlEditorForms();
    }

}
