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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrPropertyType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Represents a single field inside a form
 */
public class EditorFormField implements Comparable<EditorFormField> {

    private static final Comparator<EditorFormField> editorFormFieldComparator = Comparator
        .comparing(EditorFormField::getTarget, Comparator.nullsFirst(EditorFormFieldTarget::compareTo))
        .thenComparing(EditorFormField::getName, Comparator.nullsFirst(String::compareToIgnoreCase));
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private String name;
    private String displayName;
    private String description;
    private String errorMessage;
    private String declaringNodeType;
    private GqlJcrPropertyType requiredType;
    private Map<String, Object> selectorOptionsMap;
    private String selectorType;
    private List<EditorFormProperty> selectorOptions;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<EditorFormFieldValueConstraint> valueConstraints;
    private List<EditorFormFieldValue> defaultValues;
    private List<EditorFormFieldValue> currentValues;
    private Boolean removed;
    private EditorFormFieldTarget target;
    private ExtendedPropertyDefinition extendedPropertyDefinition;

    public EditorFormField() {
    }

    public EditorFormField(EditorFormField field) {
        this.setName(field.name);
        this.setDisplayName(field.displayName);
        this.setDescription(field.description);
        this.setErrorMessage(field.errorMessage);
        this.setRequiredType(field.requiredType);
        this.setSelectorType(field.selectorType);
        this.setSelectorOptions(field.selectorOptions == null ? null : field.selectorOptions.stream()
            .map(EditorFormProperty::new)
            .collect(Collectors.toList()));
        this.setI18n(field.i18n);
        this.setReadOnly(field.readOnly);
        this.setMultiple(field.multiple);
        this.setMandatory(field.mandatory);
        this.setValueConstraints(field.valueConstraints == null ? null : field.valueConstraints.stream()
            .map(EditorFormFieldValueConstraint::new)
            .collect(Collectors.toList()));
        this.setDefaultValues(field.defaultValues == null ? null : new ArrayList<>(field.defaultValues));
        this.setCurrentValues(field.currentValues == null ? null : new ArrayList<>(field.currentValues));
        this.setRemoved(field.removed);
        this.setTarget(field.target);
        this.setExtendedPropertyDefinition(field.extendedPropertyDefinition);
        this.setDeclaringNodeType(field.declaringNodeType);
    }

    @GraphQLField
    @GraphQLDescription("The required type for the field")
    public GqlJcrPropertyType getRequiredType() {
        return requiredType;
    }

    public void setRequiredType(GqlJcrPropertyType requiredType) {
        this.requiredType = requiredType;
    }

    public Map<String, Object> getSelectorOptionsMap() {
        return selectorOptionsMap;
    }

    public void setSelectorOptionsMap(Map<String, Object> selectorOptionsMap) {
        this.selectorOptionsMap = selectorOptionsMap;
        this.selectorOptions = new ArrayList<>();
        serializeMap("", selectorOptionsMap);
    }

    private void serializeMap(String baseKey, Map<String, Object> selectorOptionsMap) {
        for (String key : selectorOptionsMap.keySet()) {
            Object value = selectorOptionsMap.get(key);
            if (value instanceof Map) {
                serializeMap(baseKey + key + ".", (Map<String, Object>) value);
            } else if (value instanceof List) {
                List<String> jsonStringList = ((List<?>) value).stream().map(item -> {
                    if(item instanceof Map || item instanceof List){
                        try {
                            return objectMapper.writeValueAsString(item);
                        } catch (Exception e) {
                            e.printStackTrace();
                            return null;
                        }
                    }else{
                        return item.toString();
                    }
                }).collect(Collectors.toList());
                selectorOptions.add(new EditorFormProperty(baseKey + key, jsonStringList));
            } else {
                selectorOptions.add(new EditorFormProperty(baseKey + key, value.toString()));
            }
        }
    }

    @GraphQLField
    @GraphQLDescription("Options for the selector type. For JCR definitions, this will usually include choicelist initializer name and properties.")
    public List<EditorFormProperty> getSelectorOptions() {
        return selectorOptions;
    }

    public void setSelectorOptions(List<EditorFormProperty> selectorOptions) {
        this.selectorOptions = selectorOptions;
    }

    @GraphQLField
    @GraphQLDescription("This array contains the list of possible values to choose from")
    public List<EditorFormFieldValueConstraint> getValueConstraints() {
        return valueConstraints;
    }

    public void setValueConstraints(List<EditorFormFieldValueConstraint> valueConstraints) {
        this.valueConstraints = valueConstraints;
    }

    @GraphQLField
    @GraphQLDescription("The name of the field")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("The displayable name of the field")
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @GraphQLField
    @GraphQLDescription("The description of the field")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @GraphQLField
    @GraphQLDescription("The error message of the field")
    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @GraphQLField
    @GraphQLDescription("The declaring node type for the field")
    public String getDeclaringNodeType() {
        return declaringNodeType;
    }

    public void setDeclaringNodeType(String declaringNodeType) {
        this.declaringNodeType = declaringNodeType;
    }

    @GraphQLField
    @GraphQLDescription("The selector type for the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getSelectorType() {
        return selectorType;
    }

    public void setSelectorType(String selectorType) {
        this.selectorType = selectorType;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default values for the field.")
    public List<EditorFormFieldValue> getDefaultValues() {
        return defaultValues;
    }

    public void setDefaultValues(List<EditorFormFieldValue> defaultValues) {
        this.defaultValues = defaultValues;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field allows for internationalized values")
    public Boolean getI18n() {
        return i18n;
    }

    public void setI18n(Boolean i18n) {
        this.i18n = i18n;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is readonly. This could be due to locks or permissions")
    public Boolean getReadOnly() {
        return readOnly;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field value is multi-valued.")
    public Boolean getMultiple() {
        return multiple;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is mandatory")
    public Boolean getMandatory() {
        return mandatory;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }

    public EditorFormFieldTarget getTarget() {
        return target;
    }

    public void setTarget(EditorFormFieldTarget target) {
        this.target = target;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the current existing values for the field.")
    public List<EditorFormFieldValue> getCurrentValues() {
        return currentValues;
    }

    public void setCurrentValues(List<EditorFormFieldValue> currentValues) {
        this.currentValues = currentValues;
    }

    public ExtendedPropertyDefinition getExtendedPropertyDefinition() {
        return extendedPropertyDefinition;
    }

    @JsonIgnore
    public void setExtendedPropertyDefinition(ExtendedPropertyDefinition extendedPropertyDefinition) {
        this.extendedPropertyDefinition = extendedPropertyDefinition;
    }

    public boolean isRemoved() {
        if (removed == null) {
            return false;
        }
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    private static Boolean mergeBooleanKeepTrue(Boolean value1, Boolean value2) {
        if (value1 == null) {
            if (value2 == null) {
                return null;
            } else {
                return value2;
            }
        } else { // value 1 != null
            if (value1) {
                return true;
            } else {
                if (value2 != null)
                    return value2;
                else
                    return value1;
            }
        }
    }

    public EditorFormField mergeWith(EditorFormField otherEditorFormField) {
        if (!name.equals(otherEditorFormField.name)) {
            return this;
        }

        EditorFormField newField = new EditorFormField();
        newField.setName(name);
        newField.setDisplayName(otherEditorFormField.displayName != null ? otherEditorFormField.displayName : displayName);
        newField.setDescription(otherEditorFormField.description != null ? otherEditorFormField.description : description);
        newField.setErrorMessage(otherEditorFormField.errorMessage != null ? otherEditorFormField.errorMessage : errorMessage);
        newField.setRequiredType(otherEditorFormField.requiredType != null ? otherEditorFormField.requiredType : requiredType);
        newField.setSelectorType(otherEditorFormField.selectorType != null ? otherEditorFormField.selectorType : selectorType);
        newField.setSelectorOptions(otherEditorFormField.selectorOptions != null ? otherEditorFormField.selectorOptions : selectorOptions);
        newField.setI18n(i18n != null ? i18n : otherEditorFormField.i18n);
        newField.setReadOnly(mergeBooleanKeepTrue(readOnly, otherEditorFormField.readOnly));
        newField.setMultiple(multiple != null ? multiple : otherEditorFormField.multiple);
        newField.setMandatory(mergeBooleanKeepTrue(mandatory, otherEditorFormField.mandatory));
        newField.setValueConstraints(otherEditorFormField.valueConstraints != null ? otherEditorFormField.valueConstraints : valueConstraints);
        newField.setDefaultValues(otherEditorFormField.defaultValues != null ? otherEditorFormField.defaultValues : defaultValues);
        newField.setCurrentValues(otherEditorFormField.currentValues != null ? otherEditorFormField.currentValues : currentValues);
        newField.setRemoved(otherEditorFormField.removed != null ? otherEditorFormField.removed : removed);
        newField.setTarget(mergeTargets(otherEditorFormField));
        newField.setExtendedPropertyDefinition(extendedPropertyDefinition != null ? extendedPropertyDefinition : otherEditorFormField.extendedPropertyDefinition);
        newField.setDeclaringNodeType(otherEditorFormField.declaringNodeType != null ? otherEditorFormField.declaringNodeType : declaringNodeType);
        return newField;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EditorFormField that = (EditorFormField) o;
        return Objects.equals(name, that.name)
            && Objects.equals(displayName, that.displayName)
            && Objects.equals(description, that.description)
            && Objects.equals(errorMessage, that.errorMessage)
            && Objects.equals(requiredType, that.requiredType)
            && Objects.equals(selectorType, that.selectorType)
            && Objects.equals(selectorOptions, that.selectorOptions)
            && Objects.equals(i18n, that.i18n)
            && Objects.equals(readOnly, that.readOnly)
            && Objects.equals(multiple, that.multiple)
            && Objects.equals(mandatory, that.mandatory)
            && Objects.equals(valueConstraints, that.valueConstraints)
            && Objects.equals(defaultValues, that.defaultValues)
            && Objects.equals(currentValues, that.currentValues)
            && Objects.equals(removed, that.removed)
            && Objects.equals(target, that.target)
            && Objects.equals(extendedPropertyDefinition, that.extendedPropertyDefinition)
            && Objects.equals(declaringNodeType, that.declaringNodeType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, displayName, description, errorMessage, requiredType, selectorType, selectorOptions,
            i18n, readOnly, multiple, mandatory, valueConstraints, defaultValues, currentValues, removed,
            target, extendedPropertyDefinition, declaringNodeType);
    }

    @Override
    public String toString() {
        return "EditorFormField{" +
            "name='" + name + '\'' +
            ", displayName='" + displayName + '\'' +
            ", description='" + description + '\'' +
            ", errorMessage='" + errorMessage + '\'' +
            ", requiredType='" + requiredType + '\'' +
            ", selectorType='" + selectorType + '\'' +
            ", selectorOptions=" + selectorOptions +
            ", i18n=" + i18n +
            ", readOnly=" + readOnly +
            ", multiple=" + multiple +
            ", mandatory=" + mandatory +
            ", valueConstraints=" + valueConstraints +
            ", defaultValues=" + defaultValues +
            ", currentValues=" + currentValues +
            ", removed=" + removed +
            ", target=" + target +
            ", extendedPropertyDefinition=" + extendedPropertyDefinition +
            ", declaringNodeType=" + declaringNodeType +
            '}';
    }

    private EditorFormFieldTarget mergeTargets(EditorFormField otherEditorFormField) {
        if (target == null) {
            if (otherEditorFormField.target != null) {
                return otherEditorFormField.target;
            } else {
                return null;
            }
        }
        EditorFormFieldTarget mergedEditorFormFieldTarget = new EditorFormFieldTarget(target.getSectionName(), target.getFieldSetName(), target.getRank());
        if (otherEditorFormField.target != null) {
            Double otherEditorFormFieldTargetRank = otherEditorFormField.target.getRank();
            if (otherEditorFormFieldTargetRank != null) {
                mergedEditorFormFieldTarget.setRank(otherEditorFormFieldTargetRank);
            }
            if (otherEditorFormField.target.getSectionName() != null && otherEditorFormField.target.getFieldSetName() != null) {
                mergedEditorFormFieldTarget.setSectionName(otherEditorFormField.target.getSectionName());
                mergedEditorFormFieldTarget.setFieldSetName(otherEditorFormField.target.getFieldSetName());
            }
        }
        return mergedEditorFormFieldTarget;
    }

    @Override
    public int compareTo(EditorFormField other) {
        return editorFormFieldComparator.compare(this, other);
    }
}
