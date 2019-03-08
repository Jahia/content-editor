package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.List;

public class EditorForm {
    private String nodeType;
    private List<EditorFormTarget> editorFormTargets;

    public EditorForm(String nodeType, List<EditorFormTarget> editorFormTargets) {
        this.nodeType = nodeType;
        this.editorFormTargets = editorFormTargets;
    }

    @GraphQLField
    @GraphQLDescription("Get the associated node type name")
    public String getNodeType() {
        return nodeType;
    }

    @GraphQLField
    @GraphQLName("targets")
    @GraphQLDescription("List of editor form targets, ie groupings of editor form fields")
    public List<EditorFormTarget> getEditorFormTargets() {
        return editorFormTargets;
    }
}
