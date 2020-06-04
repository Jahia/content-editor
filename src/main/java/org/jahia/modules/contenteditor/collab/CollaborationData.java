package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CollaborationData {
    private Set<String> users = new HashSet<>();

    @GraphQLField
    @GraphQLName("users")
    public Set<String> getUsers() {
        return users;
    }

    void addUsers(String user) {
        users.add(user);
    }

    void removeUsers(String user) {
        users.remove(user);
    }
}
