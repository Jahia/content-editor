package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.List;

public class EditorFormTarget {

    private String name;
    private List<EditorFormField> editorFormFields;

    public EditorFormTarget(String name, List<EditorFormField> editorFormFields) {
        this.name = name;
        this.editorFormFields = editorFormFields;
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
}
