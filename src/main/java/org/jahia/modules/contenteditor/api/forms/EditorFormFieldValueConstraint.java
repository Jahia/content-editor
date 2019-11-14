/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2019 Jahia Solutions Group SA. All rights reserved.
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
