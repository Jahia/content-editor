package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.osgi.framework.Bundle;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * This structure represents a logical set of fields
 */
public class EditorFormFieldSet implements Comparable<EditorFormFieldSet> {
    private static final double THRESHOLD = .0001;
    private String name;
    private String displayName;
    private String description;
    private Bundle originBundle;
    private Double rank;
    private Double priority;
    private Boolean dynamic = false;
    private Boolean activated = true; // this is only used when dynamic is true
    private List<EditorFormField> editorFormFields = new ArrayList<>();
    private Map<String, EditorFormField> editorFormFieldsByName = new LinkedHashMap<>();

    public EditorFormFieldSet() {
    }

    public EditorFormFieldSet(String name, List<EditorFormField> editorFormFields) {
        this.name = name;
        setEditorFormFields(editorFormFields);
    }

    @GraphQLField
    @GraphQLDescription("Get the associated node type name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    @GraphQLField
    @GraphQLName("fields")
    @GraphQLDescription("Get the fields contained in the target")
    @JsonProperty("fields")
    public List<EditorFormField> getEditorFormFields() {
        return editorFormFields;
    }

    public void setEditorFormFields(List<EditorFormField> editorFormFields) {
        this.editorFormFields = editorFormFields;
        editorFormFieldsByName.clear();
        if (editorFormFields != null) {
            for (EditorFormField editorFormField : editorFormFields) {
                editorFormFieldsByName.put(editorFormField.getName(), editorFormField);
            }
        }
    }

    public boolean addField(EditorFormField editorFormField) {
        editorFormFieldsByName.put(editorFormField.getName(), editorFormField);
        return editorFormFields.add(editorFormField);
    }

    @Override
    public String toString() {
        return "EditorFormFieldSet{" + "nodeType='" + name + '\'' + ", originBundle=" + originBundle + ", priority=" + priority
            + ", editorFormFields=" + editorFormFields + ", editorFormFieldsByName=" + editorFormFieldsByName + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EditorFormFieldSet that = (EditorFormFieldSet) o;

        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        return priority != null ? Math.abs(priority - that.priority) < THRESHOLD : that.priority == null;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (priority != null ? priority.hashCode() : 0);
        return result;
    }

    @Override
    public int compareTo(EditorFormFieldSet otherEditorFormFieldSet) {
        if (otherEditorFormFieldSet == null) {
            return -1;
        }
        int compareNodeType = name.compareTo(otherEditorFormFieldSet.name);
        if (compareNodeType != 0) {
            return compareNodeType;
        }
        if (priority == null) {
            if (otherEditorFormFieldSet.priority != null) return -1;
            else return 0;
        } else {
            if (otherEditorFormFieldSet.priority == null) return 1;
            return priority.compareTo(otherEditorFormFieldSet.priority);
        }
    }

    /**
     * This method will merge another editor form into this one, with special rules as to which fields may be overriden
     * or not, as well as how to add/remove targets and/or fields inside targets.
     *
     * @param otherEditorFormFieldSet the other editor for to merge with.
     * @return the resulting merged object.
     */
    public EditorFormFieldSet mergeWith(EditorFormFieldSet otherEditorFormFieldSet) {
        if (!name.equals(otherEditorFormFieldSet.name)) {
            // nodetypes are not equal, we won't merge anything.
            return this;
        }
        List<EditorFormField> mergedEditorFormFields = new ArrayList<>();
        if (editorFormFields != null) {
            for (EditorFormField editorFormField : editorFormFields) {
                EditorFormField otherFormField = otherEditorFormFieldSet.editorFormFieldsByName.get(editorFormField.getName());
                if (otherFormField == null && !editorFormField.isRemoved()) {
                    mergedEditorFormFields.add(editorFormField);
                    continue;
                }
                if (otherFormField != null) {
                    EditorFormField mergedEditorFormField = editorFormField.mergeWith(otherFormField);
                    if (!mergedEditorFormField.isRemoved()) {
                        mergedEditorFormFields.add(mergedEditorFormField);
                    }
                }
            }
        }
        // we now need to add all the fields that are in the other but not in ours, but only if they are not removed fields
        if (otherEditorFormFieldSet.editorFormFields != null) {
            for (EditorFormField otherEditorFormField : otherEditorFormFieldSet.editorFormFields) {
                if (editorFormFieldsByName.get(otherEditorFormField.getName()) == null && !otherEditorFormField.isRemoved()) {
                    mergedEditorFormFields.add(otherEditorFormField);
                }
            }
        }
        EditorFormFieldSet newEditorFormFieldSet = new EditorFormFieldSet(name, mergedEditorFormFields);
        if (otherEditorFormFieldSet.priority == null) {
            newEditorFormFieldSet.setPriority(priority);
        } else {
            newEditorFormFieldSet.setPriority(otherEditorFormFieldSet.priority);
        }
        return newEditorFormFieldSet;
    }

}
