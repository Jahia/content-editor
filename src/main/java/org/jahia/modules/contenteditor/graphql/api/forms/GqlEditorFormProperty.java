package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

import java.util.List;

public class GqlEditorFormProperty {
    private String name;
    private String value;
    private List<String> values;

    public GqlEditorFormProperty(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public GqlEditorFormProperty(String name, List<String> values) {
        this.name = name;
        this.values = values;
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

    @GraphQLField
    @GraphQLDescription("Property values")
    public List<String> getValues() {
        return values;
    }

    public void setValues(List<String> values) {
        this.values = values;
    }
}
