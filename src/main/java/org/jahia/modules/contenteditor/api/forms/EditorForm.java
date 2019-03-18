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
 * This is the root class for the editor form structure.
 */
public class EditorForm implements Comparable<EditorForm> {
    private String nodeType;
    private Bundle originBundle;
    private Double priority;
    private List<EditorFormField> editorFormFields = new ArrayList<>();
    private Map<String,EditorFormField> editorFormFieldsByName = new LinkedHashMap<>();

    public EditorForm() {
    }

    public EditorForm(String nodeType, List<EditorFormField> editorFormFields) {
        this.nodeType = nodeType;
        setEditorFormFields(editorFormFields);
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    @GraphQLField
    @GraphQLDescription("Get the associated node type name")
    public String getNodeType() {
        return nodeType;
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

    public boolean addField(EditorFormField editorFormField) {
        editorFormFieldsByName.put(editorFormField.getName(), editorFormField);
        return editorFormFields.add(editorFormField);
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

    @Override
    public String toString() {
        return "EditorForm{" + "nodeType='" + nodeType + '\'' + ", originBundle=" + originBundle + ", priority=" + priority
                + ", editorFormFields=" + editorFormFields + ", editorFormFieldsByName=" + editorFormFieldsByName + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EditorForm that = (EditorForm) o;

        if (nodeType != null ? !nodeType.equals(that.nodeType) : that.nodeType != null) return false;
        return priority != null ? priority.equals(that.priority) : that.priority == null;
    }

    @Override
    public int hashCode() {
        int result = nodeType != null ? nodeType.hashCode() : 0;
        result = 31 * result + (priority != null ? priority.hashCode() : 0);
        return result;
    }

    @Override
    public int compareTo(EditorForm otherEditorForm) {
        if (otherEditorForm == null) {
            return -1;
        }
        int compareNodeType = nodeType.compareTo(otherEditorForm.nodeType);
        if (compareNodeType != 0) {
            return compareNodeType;
        }
        if (priority == null) {
            if (otherEditorForm.priority != null) return -1; else return 0;
        } else {
            if (otherEditorForm.priority == null) return 1;
            return priority.compareTo(otherEditorForm.priority);
        }
    }

    /**
     * This method will merge another editor form into this one, with special rules as to which fields may be overriden
     * or not, as well as how to add/remove targets and/or fields inside targets.
     * @param otherEditorForm the other editor for to merge with.
     * @return the resulting merged object.
     */
    public EditorForm mergeWith(EditorForm otherEditorForm) {
        if (!nodeType.equals(otherEditorForm.nodeType)) {
            // nodetypes are not equal, we won't merge anything.
            return this;
        }
        List<EditorFormField> mergedEditorFormFields = new ArrayList<>();
        if (editorFormFields != null) {
            for (EditorFormField editorFormField : editorFormFields) {
                EditorFormField otherFormField = otherEditorForm.editorFormFieldsByName.get(editorFormField.getName());
                if (otherFormField == null && !editorFormField.isRemoved()) {
                    mergedEditorFormFields.add(editorFormField);
                    continue;
                }
                EditorFormField mergedEditorFormField = editorFormField.mergeWith(otherFormField);
                if (mergedEditorFormField != null && !mergedEditorFormField.isRemoved()) {
                    mergedEditorFormFields.add(mergedEditorFormField);
                }
            }
        }
        // we now need to add all the fields that are in the other but not in ours, but only if they are not removed fields
        if (otherEditorForm.editorFormFields != null) {
            for (EditorFormField otherEditorFormField : otherEditorForm.editorFormFields) {
                if (editorFormFieldsByName.get(otherEditorFormField.getName()) == null && !otherEditorFormField.isRemoved()) {
                    mergedEditorFormFields.add(otherEditorFormField);
                }
            }
        }
        EditorForm newEditorForm = new EditorForm(nodeType, mergedEditorFormFields);
        if (otherEditorForm.priority == null) {
            newEditorForm.setPriority(priority);
        } else {
            newEditorForm.setPriority(otherEditorForm.priority);
        }
        return newEditorForm;
    }

}
