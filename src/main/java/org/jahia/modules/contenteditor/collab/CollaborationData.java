package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.*;

public class CollaborationData {
    private Map<String, CollaborationUser> users = new HashMap<>();
    private List<CollaborationMessage> messages = new ArrayList<>();
    private CollaborationUser currentUser;

    // Users
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

    // Messages
    @GraphQLField
    @GraphQLName("messages")
    public List<CollaborationMessage> getMessages() {
        return messages;
    }

    void addMessage(CollaborationMessage message) {
        messages.add(message);
    }

    // Current user
    @GraphQLField
    @GraphQLName("currentUser")
    public CollaborationUser getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(CollaborationUser currentUser) {
        this.currentUser = currentUser;
    }
}
