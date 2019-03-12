package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * An editor form target represents a collection of form fields.
 */
public class EditorFormTarget {

    private String name;
    private List<EditorFormField> editorFormFields = new ArrayList<>();
    private Map<String,EditorFormField> editorFormFieldsByName = new LinkedHashMap<>();

    public EditorFormTarget() {
    }

    public EditorFormTarget(String name) {
        this.name = name;
    }

    public EditorFormTarget(String name, List<EditorFormField> editorFormFields) {
        this.name = name;
        setEditorFormFields(editorFormFields);
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("The name of the target")
    public String getName() {
        return name;
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
        for (EditorFormField editorFormField : editorFormFields) {
            editorFormFieldsByName.put(editorFormField.getName(), editorFormField);
        }
    }

    public EditorFormTarget mergeWith(EditorFormTarget otherEditorFormTarget) {
        // if names don't match we don't merge, return the first target untouched
        if (!name.equals(otherEditorFormTarget.getName())) {
            return this;
        }
        List<EditorFormField> mergedEditorFormFields = new ArrayList<>();
        for (EditorFormField editorFormField : editorFormFields) {
            EditorFormField otherFormField = otherEditorFormTarget.editorFormFieldsByName.get(editorFormField.getName());
            if (otherFormField == null && !editorFormField.isRemoved()) {
                mergedEditorFormFields.add(editorFormField);
                continue;
            }
            EditorFormField mergedEditorFormField = editorFormField.mergeWith(otherFormField);
            if (mergedEditorFormField != null && !mergedEditorFormField.isRemoved()) {
                mergedEditorFormFields.add(mergedEditorFormField);
            }
        }
        // we now need to add all the fields that are in the other but not in ours, but only if they are not removed fields
        for (EditorFormField otherEditorFormField : otherEditorFormTarget.editorFormFields) {
            if (editorFormFieldsByName.get(otherEditorFormField.getName()) == null && !otherEditorFormField.isRemoved()) {
                mergedEditorFormFields.add(otherEditorFormField);
            }
        }
        if (mergedEditorFormFields.isEmpty()) {
            return null;
        }
        return new EditorFormTarget(name, mergedEditorFormFields);
    }

}
