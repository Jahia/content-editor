package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.List;

/*
 * Represents a single value constraint among a list of possible values for a field
 */
public class EditorFormFieldValueConstraint {

    private String displayValue;
    private EditorFormFieldValue value;
    private List<EditorFormProperty> propertyList;

    public EditorFormFieldValueConstraint() {
    }

    public EditorFormFieldValueConstraint(String displayValue, EditorFormFieldValue value, List<EditorFormProperty> propertyList) {
        this.displayValue = displayValue;
        this.value = value;
        this.propertyList = propertyList;
    }

    @GraphQLField
    @GraphQLDescription("The value as it is intended to be displayed in UIs")
    public String getDisplayValue() {
        return displayValue;
    }

    public void setDisplayValue(String displayValue) {
        this.displayValue = displayValue;
    }

    @GraphQLField
    @GraphQLDescription("The actual value to be used in storage")
    public EditorFormFieldValue getValue() {
        return value;
    }

    public void setValue(EditorFormFieldValue value) {
        this.value = value;
    }

    @GraphQLField
    @GraphQLName("properties")
    @GraphQLDescription("The properties for the value")
    public List<EditorFormProperty> getPropertyList() {
        return propertyList;
    }

    public void setPropertyList(List<EditorFormProperty> propertyList) {
        this.propertyList = propertyList;
    }
}
