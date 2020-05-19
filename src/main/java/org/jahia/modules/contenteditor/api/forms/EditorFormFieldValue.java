/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
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
