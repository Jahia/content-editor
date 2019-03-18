package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

    public EditorFormFieldValueConstraint(EditorFormFieldValueConstraint constraint) {
        this(
                constraint.displayValue,
                constraint.value,
                constraint.propertyList == null ? null : constraint.propertyList.stream()
                        .map(property -> new EditorFormProperty(property))
                        .collect(Collectors.toList())
        );
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

    @Override
    public String toString() {
        return "EditorFormFieldValueConstraint{displayValue='" + displayValue + '\'' + ", value=" + value + ", propertyList="
                + propertyList + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EditorFormFieldValueConstraint that = (EditorFormFieldValueConstraint) o;
        return Objects.equals(displayValue, that.displayValue)
                && Objects.equals(value, that.value)
                && Objects.equals(propertyList, that.propertyList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(displayValue, value, propertyList);
    }
}
