package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

import java.util.ArrayList;
import java.util.List;

/**
 * An editor form represents the complete structure that is used to edit a primary node type. It contains an ordered
 * list of sections that contain the sub-structured data
 */
public class EditorForm {

    String name;
    String displayName;
    String description;
    Double priority;

    List<EditorFormSection> sections = new ArrayList<>();

    public EditorForm() {
    }

    public EditorForm(String name, String displayName, String description, Double priority, List<EditorFormSection> sections) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.priority = priority;
        this.sections = sections;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the name (aka identifier) of the form")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the displayable name of the form (in a specific language)")
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve a description text for the form, might contain explanations on how to use the form")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the sections that make up the form")
    public List<EditorFormSection> getSections() {
        return sections;
    }

    public void setSections(List<EditorFormSection> sections) {
        this.sections = sections;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

}
