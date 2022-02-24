/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrMutationSupport;

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

    public EditorFormFieldValue(Long longValue) {
        this.type = PropertyType.TYPENAME_LONG;
        this.value = String.valueOf(longValue);
    }

    public EditorFormFieldValue(Double doubleValue) {
        this.type = PropertyType.TYPENAME_DOUBLE;
        this.value = String.valueOf(doubleValue);
    }

    public EditorFormFieldValue(Boolean booleanValue) {
        this.type = PropertyType.TYPENAME_BOOLEAN;
        this.value = String.valueOf(booleanValue);
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
                SimpleDateFormat defaultDataFormat = new SimpleDateFormat(GqlJcrMutationSupport.DEFAULT_DATE_FORMAT);
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

    public String getValue() {
        // Allows ObjectMapper to correctly fill the field when customizing constraint value with json file
        return value;
    }

    @Override
    public String toString() {
        return "EditorFormFieldValue{type='" + type + '\''+ ", value='" + value + '\'' + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EditorFormFieldValue that = (EditorFormFieldValue) o;
        return Objects.equals(type, that.type)
            && Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, value);
    }
}
