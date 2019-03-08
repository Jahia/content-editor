package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLField;

import java.util.List;

public class EditorFormField {

    private String name;
    private String type;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private List<String> values;
    private String defaultValue;

    public EditorFormField(String name, String type, Boolean i18n, Boolean readOnly, Boolean multiple, List<String> values, String defaultValue) {
        this.name = name;
        this.type = type;
        this.i18n = i18n;
        this.readOnly = readOnly;
        this.multiple = multiple;
        this.values = values;
        this.defaultValue = defaultValue;
    }

    @GraphQLField
    public String getName() {
        return name;
    }

    @GraphQLField
    public String getType() {
        return type;
    }

    @GraphQLField
    public Boolean getI18n() {
        return i18n;
    }

    @GraphQLField
    public Boolean getReadOnly() {
        return readOnly;
    }

    @GraphQLField
    public Boolean getMultiple() {
        return multiple;
    }

    @GraphQLField
    public List<String> getValues() {
        return values;
    }

    @GraphQLField
    public String getDefaultValue() {
        return defaultValue;
    }
}
