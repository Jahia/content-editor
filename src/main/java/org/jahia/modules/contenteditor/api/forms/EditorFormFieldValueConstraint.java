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

    private String displayValueKey;

    private EditorFormFieldValue value;
    private List<EditorFormProperty> propertyList;

    public EditorFormFieldValueConstraint() {
    }

    public EditorFormFieldValueConstraint(String displayValue, String displayValueKey, EditorFormFieldValue value, List<EditorFormProperty> propertyList) {
        this.displayValue = displayValue;
        this.displayValueKey = displayValueKey;
        this.value = value;
        this.propertyList = propertyList;
    }

    public EditorFormFieldValueConstraint(EditorFormFieldValueConstraint constraint) {
        this(
            constraint.displayValue,
            constraint.displayValueKey,
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
    @GraphQLDescription("The key of the value to get the translated value from the client side")
    public String getDisplayValueKey() {
        return displayValueKey;
    }

    public void setDisplayValueKey(String displayValueKey) {
        this.displayValueKey = displayValueKey;
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
