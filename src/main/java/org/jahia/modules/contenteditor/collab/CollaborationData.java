package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.*;

public class CollaborationData {
    private Map<String, CollaborationUser> users = new HashMap<>();

    @GraphQLField
    @GraphQLName("users")
    public Collection<CollaborationUser> getUsers() {
        return users.values();
    }

    boolean isUserConnected(String userKey) {
        return users.containsKey(userKey);
    }

    void addUsers(CollaborationUser user) {
        users.put(user.getUserKey(), user);
    }

    void removeUsers(String userKey) {
        users.remove(userKey);
    }
}
