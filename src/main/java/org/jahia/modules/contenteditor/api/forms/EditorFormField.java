package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonIgnore;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Represents a single field inside a form
 */
public class EditorFormField {

    private String name;
    private String displayName;
    private String selectorType;
    private List<EditorFormProperty> selectorOptions;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<EditorFormFieldValueConstraint> valueConstraints;
    private List<EditorFormFieldValue> defaultValues;
    private Boolean removed;
    private List<EditorFormFieldTarget> targets;
    private Map<String, Double> targetsByName = new HashMap<>();
    private ExtendedPropertyDefinition extendedPropertyDefinition;

    public EditorFormField() {
    }

    public EditorFormField(String name,
                           String displayName,
                           String selectorType,
                           List<EditorFormProperty> selectorOptions,
                           Boolean i18n,
                           Boolean readOnly,
                           Boolean multiple,
                           Boolean mandatory,
                           List<EditorFormFieldValueConstraint> valueConstraints,
                           List<EditorFormFieldValue> defaultValues,
                           Boolean removed,
                           List<EditorFormFieldTarget> targets,
                           ExtendedPropertyDefinition extendedPropertyDefinition) {
        this.name = name;
        this.displayName = displayName;
        this.selectorType = selectorType;
        this.selectorOptions = selectorOptions;
        this.i18n = i18n;
        this.readOnly = readOnly;
        this.multiple = multiple;
        this.mandatory = mandatory;
        this.valueConstraints = valueConstraints;
        this.defaultValues = defaultValues;
        this.removed = removed;
        setTargets(targets);
        this.extendedPropertyDefinition = extendedPropertyDefinition;
    }

    public EditorFormField(EditorFormField field) {
        this(
            field.name,
            field.displayName,
            field.selectorType,
            field.selectorOptions == null ? null : field.selectorOptions.stream()
                .map(option -> new EditorFormProperty(option))
                .collect(Collectors.toList()),
            field.i18n,
            field.readOnly,
            field.multiple,
            field.mandatory,
            field.valueConstraints == null ? null : field.valueConstraints.stream()
                .map(constraint -> new EditorFormFieldValueConstraint(constraint))
                .collect(Collectors.toList()),
            field.defaultValues == null ? null : new ArrayList<>(field.defaultValues),
            field.removed,
            field.targets == null ? null : field.targets.stream()
                .map(target -> new EditorFormFieldTarget(target))
                .collect(Collectors.toList()),
            // No deep copy is needed as this object is just read and only references are used
            field.extendedPropertyDefinition
        );
    }

    public void setName(String name) {
        this.name = name;
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

    public void setTargets(List<EditorFormFieldTarget> targets) {
        this.targets = targets;
        if (targets != null) {
            for (EditorFormFieldTarget editorFormFieldTarget : targets) {
                this.targetsByName.put(editorFormFieldTarget.getSectionName(), editorFormFieldTarget.getRank());
            }
        }
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
    @GraphQLDescription("The selector type for the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getSelectorType() {
        return selectorType;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default values for the field.")
    public List<EditorFormFieldValue> getDefaultValues() {
        return defaultValues;
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

    public void setDefaultValues(List<EditorFormFieldValue> defaultValues) {
        this.defaultValues = defaultValues;
    }

    public ExtendedPropertyDefinition getExtendedPropertyDefinition() {
        return extendedPropertyDefinition;
    }

    @GraphQLField
    @GraphQLDescription("The targets this fields should be present in and the ranking in each target")
    public List<EditorFormFieldTarget> getTargets() {
        return targets;
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
        return new EditorFormField(name,
            otherEditorFormField.displayName != null ? otherEditorFormField.displayName : displayName,
            otherEditorFormField.selectorType != null ? otherEditorFormField.selectorType : selectorType,
            otherEditorFormField.selectorOptions != null ? otherEditorFormField.selectorOptions : selectorOptions,
            i18n != null ? i18n : otherEditorFormField.i18n,
            mergeBooleanKeepTrue(readOnly, otherEditorFormField.readOnly),
            multiple != null ? multiple : otherEditorFormField.multiple,
            mergeBooleanKeepTrue(mandatory, otherEditorFormField.mandatory),
            otherEditorFormField.valueConstraints != null ? otherEditorFormField.valueConstraints : valueConstraints,
            otherEditorFormField.defaultValues != null ? otherEditorFormField.defaultValues : defaultValues,
            otherEditorFormField.removed != null ? otherEditorFormField.removed : removed,
            mergeTargets(otherEditorFormField),
            extendedPropertyDefinition != null ? extendedPropertyDefinition : otherEditorFormField.extendedPropertyDefinition
        );
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
            && Objects.equals(selectorType, that.selectorType)
            && Objects.equals(selectorOptions, that.selectorOptions)
            && Objects.equals(i18n, that.i18n)
            && Objects.equals(readOnly, that.readOnly)
            && Objects.equals(multiple, that.multiple)
            && Objects.equals(mandatory, that.mandatory)
            && Objects.equals(valueConstraints, that.valueConstraints)
            && Objects.equals(defaultValues, that.defaultValues)
            && Objects.equals(removed, that.removed)
            && Objects.equals(targets, that.targets)
            && Objects.equals(targetsByName, that.targetsByName)
            && Objects.equals(extendedPropertyDefinition, that.extendedPropertyDefinition);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, displayName, selectorType, selectorOptions, i18n,
            readOnly, multiple, mandatory, valueConstraints, defaultValues, removed,
            targets, targetsByName, extendedPropertyDefinition);
    }

    @Override
    public String toString() {
        return "EditorFormField{" +
            "name='" + name + '\'' +
            ", displayName='" + displayName + '\'' +
            ", selectorType='" + selectorType + '\'' +
            ", selectorOptions=" + selectorOptions +
            ", i18n=" + i18n +
            ", readOnly=" + readOnly +
            ", multiple=" + multiple +
            ", mandatory=" + mandatory +
            ", valueConstraints=" + valueConstraints +
            ", defaultValues=" + defaultValues +
            ", removed=" + removed +
            ", targets=" + targets +
            ", targetsByName=" + targetsByName +
            ", extendedPropertyDefinition=" + extendedPropertyDefinition +
            '}';
    }

    private Boolean mergeBooleanKeepTrue(Boolean value1, Boolean value2) {
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

    private List<EditorFormFieldTarget> mergeTargets(EditorFormField otherEditorFormField) {
        List<EditorFormFieldTarget> mergedEditorFormFieldTargets = new ArrayList<>();
        if (targets == null && otherEditorFormField.targets != null) {
            mergedEditorFormFieldTargets.addAll(otherEditorFormField.targets);
            return mergedEditorFormFieldTargets;
        }
        if (targets != null) {
            for (EditorFormFieldTarget editorFormFieldTarget : targets) {
                Double otherEditorFormFieldTargetRank = otherEditorFormField.targetsByName.get(editorFormFieldTarget.getSectionName());
                if (otherEditorFormFieldTargetRank != null) {
                    mergedEditorFormFieldTargets
                        .add(new EditorFormFieldTarget(editorFormFieldTarget.getSectionName(), otherEditorFormFieldTargetRank));
                } else {
                    mergedEditorFormFieldTargets.add(new EditorFormFieldTarget(editorFormFieldTarget.getSectionName(), editorFormFieldTarget.getRank()));
                }
            }
        }
        if (otherEditorFormField.targets != null) {
            for (EditorFormFieldTarget otherEditorFormFieldTarget : otherEditorFormField.targets) {
                if (targetsByName.get(otherEditorFormFieldTarget.getSectionName()) == null) {
                    mergedEditorFormFieldTargets.add(new EditorFormFieldTarget(otherEditorFormFieldTarget.getSectionName(), otherEditorFormFieldTarget.getRank()));
                }
            }
        }
        return mergedEditorFormFieldTargets;
    }
}
