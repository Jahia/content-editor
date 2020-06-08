package org.jahia.modules.contenteditor.collab;

import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

public class CollaborationMessage {
    private String message;
    private String author;

    public CollaborationMessage(String message, String author) {
        this.message = message;
        this.author = author;
    }

    @GraphQLField
    @GraphQLName("message")
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @GraphQLField
    @GraphQLName("author")
    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }
}
