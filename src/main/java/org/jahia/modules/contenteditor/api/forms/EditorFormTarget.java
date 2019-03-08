package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.ArrayList;
import java.util.List;

/**
 * An editor form target represents a collection of form fields.
 */
public class EditorFormTarget {

    private String name;
    private List<EditorFormField> editorFormFields = new ArrayList<>();

    public EditorFormTarget(String name) {
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
    public List<EditorFormField> getEditorFormFields() {
        return editorFormFields;
    }

    public boolean addField(EditorFormField editorFormField) {
        return editorFormFields.add(editorFormField);
    }
}
