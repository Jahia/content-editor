package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.Objects;

/**
 * Represents a form field value
 */
public class EditorFormFieldValue {

    private String type;
    private String stringValue;
    private Long longValue;
    private Double doubleValue;
    private Boolean booleanValue;

    public EditorFormFieldValue() {
    }

    public EditorFormFieldValue(String type, String stringValue) {
        this.type = type;
        this.stringValue = stringValue;
    }

    public EditorFormFieldValue(Long longValue) {
        this.longValue = longValue;
    }

    public EditorFormFieldValue(Double doubleValue) {
        this.doubleValue = doubleValue;
    }

    public EditorFormFieldValue(Boolean booleanValue) {
        this.booleanValue = booleanValue;
    }

    public EditorFormFieldValue(Value value) throws RepositoryException {
        this.type = PropertyType.nameFromValue(value.getType());
        switch (value.getType()) {
            case PropertyType.NAME:
            case PropertyType.PATH:
            case PropertyType.REFERENCE:
            case PropertyType.STRING:
            case PropertyType.UNDEFINED:
            case PropertyType.URI:
            case PropertyType.WEAKREFERENCE:
                this.stringValue = value.getString();
                break;
            case PropertyType.LONG:
                this.longValue = value.getLong();
                break;
            case PropertyType.DOUBLE:
                this.doubleValue = value.getDouble();
                break;
            case PropertyType.DATE:
                this.longValue = value.getDate().getTimeInMillis();
                break;
            case PropertyType.BOOLEAN:
                this.booleanValue = value.getBoolean();
                break;
            case PropertyType.BINARY:
                // todo to be implemented
                break;
            case PropertyType.DECIMAL:
                // todo not yet supported
                break;
        }
    }

    @GraphQLField
    @GraphQLDescription("The type of this value")
    public String getType() {
        return type;
    }

    @GraphQLField
    @GraphQLName("string")
    @GraphQLDescription("This value's string representation")
    @JsonProperty("string")
    public String getStringValue() {
        return stringValue;
    }

    @GraphQLField
    @GraphQLName("long")
    @GraphQLDescription("This value's long representation")
    @JsonProperty("long")
    public Long getLongValue() {
        return longValue;
    }

    @GraphQLField
    @GraphQLName("double")
    @GraphQLDescription("This value's double representation")
    @JsonProperty("double")
    public Double getDoubleValue() {
        return doubleValue;
    }

    @GraphQLField
    @GraphQLName("boolean")
    @GraphQLDescription("This value's boolean representation")
    @JsonProperty("boolean")
    public Boolean getBooleanValue() {
        return booleanValue;
    }

    @Override
    public String toString() {
        return "EditorFormFieldValue{type='" + type + '\''+ ", stringValue='" + stringValue + '\'' + ", longValue=" + longValue
                + ", doubleValue=" + doubleValue + ", booleanValue=" + booleanValue + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EditorFormFieldValue that = (EditorFormFieldValue) o;
        return Objects.equals(type, that.type)
                && Objects.equals(stringValue, that.stringValue)
                && Objects.equals(longValue, that.longValue)
                && Objects.equals(doubleValue, that.doubleValue)
                && Objects.equals(booleanValue, that.booleanValue);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, stringValue, longValue, doubleValue, booleanValue);
    }

}
