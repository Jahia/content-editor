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

import com.fasterxml.jackson.annotation.JsonIgnore;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.modules.graphql.provider.dxm.node.GqlJcrPropertyType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Represents a single field inside a form
 */
public class EditorFormField implements Comparable<EditorFormField> {

    private String name;
    private String displayName;
    private String description;
    private String errorMessage;
    private String declaringNodeType;
    private GqlJcrPropertyType requiredType;
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

    private static final Comparator<EditorFormField> editorFormFieldComparator = Comparator
        .comparing(EditorFormField::getTarget, Comparator.nullsFirst(EditorFormFieldTarget::compareTo))
        .thenComparing(EditorFormField::getName, Comparator.nullsFirst(String::compareToIgnoreCase));

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

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("The required type for the field")
    public GqlJcrPropertyType getRequiredType() {
        return requiredType;
    }

    public void setSelectorType(String selectorType) {
        this.selectorType = selectorType;
    }

    @GraphQLField
    @GraphQLDescription("Options for the selector type. For JCR definitions, this will usually include choicelist initializer name and properties.")
    public List<EditorFormProperty> getSelectorOptions() {
        return selectorOptions;
    }

    public void setI18n(Boolean i18n) {
        this.i18n = i18n;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }

    public void setSelectorOptions(List<EditorFormProperty> selectorOptions) {
        this.selectorOptions = selectorOptions;
    }

    @GraphQLField
    @GraphQLDescription("This array contains the list of possible values to choose from")
    public List<EditorFormFieldValueConstraint> getValueConstraints() {
        return valueConstraints;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public void setValueConstraints(List<EditorFormFieldValueConstraint> valueConstraints) {
        this.valueConstraints = valueConstraints;
    }

    @GraphQLField
    @GraphQLDescription("The name of the field")
    public String getName() {
        return name;
    }

    @GraphQLField
    @GraphQLDescription("The displayable name of the field")
    public String getDisplayName() {
        return displayName;
    }

    @GraphQLField
    @GraphQLDescription("The description of the field")
    public String getDescription() {
        return description;
    }

    @GraphQLField
    @GraphQLDescription("The error message of the field")
    public String getErrorMessage() {
        return errorMessage;
    }

    @GraphQLField
    @GraphQLDescription("The declaring node type for the field")
    public String getDeclaringNodeType() {
        return declaringNodeType;
    }

    public void setDeclaringNodeType(String declaringNodeType) {
        this.declaringNodeType = declaringNodeType;
    }

    public void setRequiredType(GqlJcrPropertyType requiredType) {
        this.requiredType = requiredType;
    }

    @GraphQLField
    @GraphQLDescription("The selector type for the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getSelectorType() {
        return selectorType;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default values for the field.")
    public List<EditorFormFieldValue> getDefaultValues() {
        return defaultValues;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field allows for internationalized values")
    public Boolean getI18n() {
        return i18n;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is readonly. This could be due to locks or permissions")
    public Boolean getReadOnly() {
        return readOnly;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field value is multi-valued.")
    public Boolean getMultiple() {
        return multiple;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the field is mandatory")
    public Boolean getMandatory() {
        return mandatory;
    }

    public EditorFormFieldTarget getTarget() {
        return target;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the current existing values for the field.")
    public List<EditorFormFieldValue> getCurrentValues() {
        return currentValues;
    }

    public void setTarget(EditorFormFieldTarget target) {
        this.target = target;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public void setDefaultValues(List<EditorFormFieldValue> defaultValues) {
        this.defaultValues = defaultValues;
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
        newField.setMultiple(otherEditorFormField.multiple != null ? otherEditorFormField.multiple : multiple);
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
