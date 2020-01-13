package org.jahia.modules.contenteditor.graphql.extensions;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import graphql.annotations.annotationTypes.GraphQLTypeExtension;
import org.jahia.modules.contenteditor.graphql.api.GqlEditorFormMutations;
import org.jahia.modules.graphql.provider.dxm.DXGraphQLProvider;

@GraphQLTypeExtension(DXGraphQLProvider.Mutation.class)
public class MutationExtensions {

    @GraphQLField
    @GraphQLName("forms")
    @GraphQLDescription("Main access field to the DX GraphQL Form mutation API")
    public static GqlEditorFormMutations getForms() {
        return new GqlEditorFormMutations();
    }
}
