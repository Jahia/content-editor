package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.text.SimpleDateFormat;
import java.util.Objects;

import static org.jahia.utils.DateUtils.DEFAULT_DATE_FORMAT;

/**
 * Represents a form field value
 */
public class EditorFormFieldValue {

    private String type; // for the moment the type names used are the same as the JCR PropertyType names.
    private String value;

    public EditorFormFieldValue() {
    }

    public EditorFormFieldValue(String type, String value) {
        this.type = type;
        this.value = value;
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
                this.value = value.getString();
                break;
            case PropertyType.LONG:
                this.value = String.valueOf(value.getLong());
                break;
            case PropertyType.DOUBLE:
                this.value = String.valueOf(value.getDouble());
                break;
            case PropertyType.DECIMAL:
                this.value = String.valueOf(value.getDecimal());
                break;
            case PropertyType.DATE:
                // Handle date for the content editor
                SimpleDateFormat defaultDataFormat = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
                this.value = defaultDataFormat.format(value.getDate().getTime());
                break;
            case PropertyType.BOOLEAN:
                this.value = String.valueOf(value.getBoolean());
                break;
            case PropertyType.BINARY:
                // todo to be implemented
                break;
        }
    }

    @GraphQLField
    @GraphQLName("string")
    @GraphQLDescription("This value's string representation")
    @JsonProperty("string")
    public String getStringValue() {
        return value;
    }

    @GraphQLField
    @GraphQLDescription("The type of this value")
    public String getType() {
        return type;
    }

    @Override
    public String toString() {
        return "EditorFormFieldValue{type='" + type + '\''+ ", value='" + value + '\'' + '}';
    }
}
