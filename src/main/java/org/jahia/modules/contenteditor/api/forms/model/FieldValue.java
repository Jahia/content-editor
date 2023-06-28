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
package org.jahia.modules.contenteditor.api.forms.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrMutationSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * Represents a form field value
 */
public class FieldValue {
    private static final Logger logger = LoggerFactory.getLogger(FieldValue.class);

    private String type; // for the moment the type names used are the same as the JCR PropertyType names.
    private String value;

    public FieldValue() {
    }

    public FieldValue(String type, String value) {
        this.type = type;
        this.value = value;
    }

    public FieldValue(Long longValue) {
        this.type = PropertyType.TYPENAME_LONG;
        this.value = String.valueOf(longValue);
    }

    public FieldValue(Double doubleValue) {
        this.type = PropertyType.TYPENAME_DOUBLE;
        this.value = String.valueOf(doubleValue);
    }

    public FieldValue(Boolean booleanValue) {
        this.type = PropertyType.TYPENAME_BOOLEAN;
        this.value = String.valueOf(booleanValue);
    }

    public static FieldValue convert(Value value) {
        try {
            return new FieldValue(PropertyType.nameFromValue(value.getType()), convertToString(value));
        } catch (RepositoryException e) {
            logger.error("Error converting field default value", e);
        }

        return null;
    }

    private static String convertToString(Value value) throws RepositoryException {
        switch (value.getType()) {
            case PropertyType.NAME:
            case PropertyType.PATH:
            case PropertyType.REFERENCE:
            case PropertyType.STRING:
            case PropertyType.UNDEFINED:
            case PropertyType.URI:
            case PropertyType.WEAKREFERENCE:
                return value.getString();
            case PropertyType.LONG:
                return String.valueOf(value.getLong());
            case PropertyType.DOUBLE:
                return String.valueOf(value.getDouble());
            case PropertyType.DECIMAL:
                return String.valueOf(value.getDecimal());
            case PropertyType.DATE:
                // Handle date for the content editor
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(GqlJcrMutationSupport.DEFAULT_DATE_FORMAT).withZone(value.getDate().getTimeZone().toZoneId());
                return formatter.format(value.getDate().toInstant());
            case PropertyType.BOOLEAN:
                return String.valueOf(value.getBoolean());
            case PropertyType.BINARY:
                // todo to be implemented
        }

        throw new RepositoryException("Type not supported");
    }

    @JsonProperty("string")
    public String getStringValue() {
        return value;
    }

    public String getType() {
        return type;
    }

    public String getValue() {
        // Allows ObjectMapper to correctly fill the field when customizing constraint value with json file
        return value;
    }

    @Override
    public String toString() {
        return "EditorFormFieldValue{type='" + type + '\'' + ", value='" + value + '\'' + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FieldValue that = (FieldValue) o;
        return Objects.equals(type, that.type) && Objects.equals(value, that.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(type, value);
    }
}
