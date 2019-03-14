package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a single field inside a form
 */
public class EditorFormField {

    private String name;
    private String fieldType;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<String> values;
    private String defaultValue;
    private Boolean removed;
    private List<EditorFormFieldTarget> targets;
    private Map<String,Double> targetsByName = new HashMap<>();

    public EditorFormField() {
    }

    public EditorFormField(String name, String fieldType, Boolean i18n, Boolean readOnly, Boolean multiple, Boolean mandatory, List<String> values, String defaultValue, Boolean removed, List<EditorFormFieldTarget> targets) {
        this.name = name;
        this.fieldType = fieldType;
        this.i18n = i18n;
        this.readOnly = readOnly;
        this.multiple = multiple;
        this.mandatory = mandatory;
        this.values = values;
        this.defaultValue = defaultValue;
        this.removed = removed;
        setTargets(targets);
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
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

    public void setValues(List<String> values) {
        this.values = values;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

    public void setTargets(List<EditorFormFieldTarget> targets) {
        this.targets = targets;
        for (EditorFormFieldTarget editorFormFieldTarget : targets) {
            this.targetsByName.put(editorFormFieldTarget.getName(), editorFormFieldTarget.getRank());
        }
    }

    @GraphQLField
    @GraphQLDescription("The name of the field")
    public String getName() {
        return name;
    }

    @GraphQLField
    @GraphQLDescription("The type of the field. In the case of fields generated from node types, this is actually the SelectorType.")
    public String getFieldType() {
        return fieldType;
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

    @GraphQLField
    @GraphQLDescription("This array contains the list of possible values to choose from")
    public List<String> getValues() {
        return values;
    }

    @GraphQLField
    @GraphQLDescription("This value contains the default value for the field.")
    public String getDefaultValue() {
        return defaultValue;
    }

    @GraphQLField
    @GraphQLDescription("The targets this fields should be present in and the ranking in each target")
    public List<EditorFormFieldTarget> getTargets() {
        return targets;
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
                otherEditorFormField.fieldType != null ? otherEditorFormField.fieldType : fieldType,
                mergeBooleanKeepTrue(i18n,otherEditorFormField.i18n),
                mergeBooleanKeepTrue(readOnly,otherEditorFormField.readOnly),
                mergeBooleanKeepTrue(multiple, otherEditorFormField.multiple),
                mergeBooleanKeepTrue(mandatory,otherEditorFormField.mandatory),
                otherEditorFormField.values != null ? otherEditorFormField.values : values,
                otherEditorFormField.defaultValue != null ? otherEditorFormField.defaultValue : defaultValue,
                otherEditorFormField.removed != null ? otherEditorFormField.removed : removed,
                mergeTargets(otherEditorFormField)
                );
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
        for (EditorFormFieldTarget editorFormFieldTarget : targets) {
            Double otherEditorFormFieldTargetRank = otherEditorFormField.targetsByName.get(editorFormFieldTarget.getName());
            if (otherEditorFormFieldTargetRank != null) {
                mergedEditorFormFieldTargets.add(new EditorFormFieldTarget(editorFormFieldTarget.getName(), otherEditorFormFieldTargetRank));
            } else {
                mergedEditorFormFieldTargets.add(new EditorFormFieldTarget(editorFormFieldTarget.getName(), editorFormFieldTarget.getRank()));
            }
        }
        if (otherEditorFormField.targets != null) {
            for (EditorFormFieldTarget otherEditorFormFieldTarget : otherEditorFormField.targets) {
                if (targetsByName.get(otherEditorFormFieldTarget.getName()) == null) {
                    mergedEditorFormFieldTargets.add(new EditorFormFieldTarget(otherEditorFormFieldTarget.getName(), otherEditorFormFieldTarget.getRank()));
                }
            }
        }
        return mergedEditorFormFieldTargets;
    }
}
