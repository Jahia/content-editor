package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

/**
 * Represents a string property name-value pair
 */
public class EditorFormProperty {
    private String name;
    private String value;

    public EditorFormProperty() {
    }

    public EditorFormProperty(String name, String value) {
        this.name = name;
        this.value = value;
    }

    @GraphQLField
    @GraphQLDescription("Property name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("Property value")
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
