package org.jahia.modules.contenteditor.graphql.api;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

public class GqlEditorLockHeartBeat {

    @GraphQLField
    @GraphQLName("heartbeat")
    @GraphQLDescription("The empty heartbeat signal")
    public String getHeartBeat() {
        return "";
    }
}
