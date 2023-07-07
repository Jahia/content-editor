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
package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.modules.contenteditor.api.forms.model.Field;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrPropertyType;

import javax.jcr.PropertyType;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Represents a single field inside a form
 */
public class GqlEditorFormField {
    private Field field;

    public GqlEditorFormField(Field field) {
        this.field = field;
    }

    @GraphQLField
    @GraphQLDescription("The required type for the field")
    public GqlJcrPropertyType getRequiredType() {
        if (field.getRequiredType() != null) {
            return GqlJcrPropertyType.fromValue(PropertyType.valueFromName(field.getRequiredType()));
        }

        return null;
    }

    private List<GqlEditorFormProperty> serializeMap(List<GqlEditorFormProperty> flattenedOptions, String baseKey, Map<String, Object> selectorOptionsMap) {
        if (selectorOptionsMap != null) {
            for (String key : selectorOptionsMap.keySet()) {
                Object value = selectorOptionsMap.get(key);
                if (value instanceof Map) {
                    serializeMap(flattenedOptions, baseKey + key + ".", (Map<String, Object>) value);
                } else if (value instanceof List) {
                    flattenedOptions.add(new GqlEditorFormProperty(baseKey + key, (List<String>) value));
                } else {
                    flattenedOptions.add(new GqlEditorFormProperty(baseKey + key, value.toString()));
                }
            }
        }
        return flattenedOptions;
    }

    @GraphQLField
    @GraphQLDescription("Options for the selector type. For JCR definitions, this will usually include choicelist initializer name and properties.")
    public List<GqlEditorFormProperty> getSelectorOptions() {
        return serializeMap(new ArrayList<>(), "", field.getSelectorOptionsMap());
    }

    @GraphQLField
    @GraphQLDescription("This array contains the list of possible values to choose from")
    public List<GqlEditorFormValueConstraint> getValueConstraints() {
        if (field.getValueConstraints() != null) {
            return field.getValueConstraints().stream().map(GqlEditorFormValueConstraint::new).collect(Collectors.toList());
        }

        return null;
    }

    @GraphQLField
    @GraphQLDescription("The name of the field")
    public String getName() {
        return field.getName();
    }

    @GraphQLField
    @GraphQLDescription("The displayable name of the field")
    public String getDisplayName() {
        return field.getLabel();
    }

    @GraphQLField
    @GraphQLDescription("The description of the field")
    public String getDescription() {
        return field.getDescription();
    }

    @GraphQLField
    @GraphQLDescription("The error message of the field")
    public String getErrorMessage() {
        return field.getErrorMessage();
    }

    @GraphQLField
    @GraphQLDescription("The declaring node type for the field")
    public String getDeclaringNodeType() {
        if (field.getExtendedPropertyDefinition() != null) {
            return field.getExtendedPropertyDefinition().getDeclaringNodeType().getName();
        }

        return null;
    }

    @GraphQLField
    @GraphQLDescription("The selector type for the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getSelectorType() {
        return field.getSelectorType();
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default values for the field.")
    public List<GqlEditorFormValue> getDefaultValues() {
        if (field.getDefaultValues() != null) {
            return field.getDefaultValues().stream().map(GqlEditorFormValue::new).collect(Collectors.toList());
        }

        return null;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field allows for internationalized values")
    public boolean getI18n() {
        return field.isI18n() != null && field.isI18n();
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is readonly. This could be due to locks or permissions")
    public boolean getReadOnly() {
        return field.isReadOnly() != null && field.isReadOnly();
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field value is multi-valued.")
    public boolean getMultiple() {
        return field.isMultiple() != null && field.isMultiple();
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is mandatory")
    public boolean getMandatory() {
        return field.isMandatory() != null && field.isMandatory();
    }

    @GraphQLField
    @GraphQLDescription("")
    public boolean isVisible() {
        return field.isVisible();
    }
}
