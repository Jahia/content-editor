package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

public class CollaborationUser {
    private String userKey;
    private String userName;
    private String userPicture;

    public CollaborationUser(String userKey) {
        this.userKey = userKey;
    }

    @GraphQLField
    @GraphQLName("userKey")
    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    @GraphQLField
    @GraphQLName("userPicture")
    public String getUserPicture() {
        return userPicture;
    }

    public void setUserPicture(String userPicture) {
        this.userPicture = userPicture;
    }

    @GraphQLField
    @GraphQLName("userName")
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
