package org.jahia.modules.contenteditor.graphql.api.channels;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

@GraphQLName("GqlChannel")
public class GqlChannel {

    private String identifier;
    private String displayName;
    private boolean isVisible;

    public GqlChannel(@GraphQLName("identifier") String identifier, @GraphQLName("identifier") String displayName, @GraphQLName("isVisible") boolean isVisible) {
        this.identifier = identifier;
        this.displayName = displayName;
        this.isVisible = isVisible;
    }

    @GraphQLField
    @GraphQLDescription("Identifier for channel")
    public String getIdentifier() {
        return identifier;
    }

    @GraphQLField
    @GraphQLDescription("Display name for channel")
    public String getDisplayName() {
        return displayName;
    }

    @GraphQLField
    @GraphQLDescription("Is channel visible")
    public boolean isVisible() {
        return isVisible;
    }
}
