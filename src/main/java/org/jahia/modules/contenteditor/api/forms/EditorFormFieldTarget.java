package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

/**
 * Represents a form target (aka classification) alongside with the rank within that target.
 */
public class EditorFormFieldTarget implements Comparable<EditorFormFieldTarget> {
    private String name;
    private Double rank;

    public EditorFormFieldTarget() {
    }

    public EditorFormFieldTarget(String name, Double rank) {
        this.name = name;
        this.rank = rank;
    }

    @GraphQLField
    @GraphQLDescription("The name identifying the target")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("The rank of the field within the target")
    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EditorFormFieldTarget that = (EditorFormFieldTarget) o;

        if (name != null ? !name.equals(that.name) : that.name != null) return false;
        return rank != null ? rank.equals(that.rank) : that.rank == null;
    }

    @Override
    public int hashCode() {
        int result = name != null ? name.hashCode() : 0;
        result = 31 * result + (rank != null ? rank.hashCode() : 0);
        return result;
    }

    @Override
    public int compareTo(EditorFormFieldTarget otherEditorFormFieldTarget) {
        int result = 0;
        if (this.name == null) {
            if (otherEditorFormFieldTarget.name != null) {
                return -1;
            }
        } else {
            result = this.name.compareTo(otherEditorFormFieldTarget.name);
            if (result != 0) {
                return result;
            }
        }
        if (rank == null) {
            if (otherEditorFormFieldTarget.rank != null) {
                return -1;
            }
        } else {
            return rank.compareTo(otherEditorFormFieldTarget.rank);
        }
        return 0;
    }

    @Override
    public String toString() {
        return "EditorFormFieldTarget{" + "name='" + name + '\'' + ", rank=" + rank + '}';
    }
}
