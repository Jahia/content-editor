package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

import java.util.List;

/**
 * Represents a single field inside a form target.
 */
public class EditorFormField {

    private String name;
    private String type;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<String> values;
    private String defaultValue;

    public EditorFormField(String name, String type, Boolean i18n, Boolean readOnly, Boolean multiple, Boolean mandatory, List<String> values, String defaultValue) {
        this.name = name;
        this.type = type;
        this.i18n = i18n;
        this.readOnly = readOnly;
        this.multiple = multiple;
        this.mandatory = mandatory;
        this.values = values;
        this.defaultValue = defaultValue;
    }

    @GraphQLField
    @GraphQLDescription("The name of the field")
    public String getName() {
        return name;
    }

    @GraphQLField
    @GraphQLDescription("The type of the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getType() {
        return type;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field allows for internationalized values")
    public Boolean getI18n() {
        return i18n;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is readonly. This could be due to locks or permissions")
    public Boolean getReadOnly() {
        return readOnly;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field value is multi-valued.")
    public Boolean getMultiple() {
        return multiple;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is mandatory")
    public Boolean getMandatory() {
        return mandatory;
    }

    @GraphQLField
    @GraphQLDescription("This array contains the list of possible values to choose from")
    public List<String> getValues() {
        return values;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default value for the field.")
    public String getDefaultValue() {
        return defaultValue;
    }
}
