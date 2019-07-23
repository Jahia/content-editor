package org.jahia.modules.contenteditor.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

/**
 * Represents a form target (aka classification) alongside with the rank within that target.
 */
public class EditorFormFieldTarget implements Comparable<EditorFormFieldTarget> {
    private static final double THRESHOLD = .0001;
    private String sectionName;
    private String fieldSetName;
    private Double rank;

    public EditorFormFieldTarget() {
    }

    public EditorFormFieldTarget(String sectionName, String fieldSetName, Double rank) {
        this.sectionName = sectionName;
        this.fieldSetName = fieldSetName;
        this.rank = rank;
    }

    public EditorFormFieldTarget(EditorFormFieldTarget target) {
        this(target.sectionName, target.fieldSetName, target.rank);
    }

    @GraphQLField
    @GraphQLDescription("The name identifying the target")
    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
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

        if (sectionName != null ? !sectionName.equals(that.sectionName) : that.sectionName != null) return false;
        if (fieldSetName != null ? !fieldSetName.equals(that.fieldSetName) : that.fieldSetName != null) return false;
        return rank != null ? Math.abs(rank - that.rank) < THRESHOLD : that.rank == null;
    }

    @Override
    public int hashCode() {
        int result = sectionName != null ? sectionName.hashCode() : 0;
        result = 31 * result + (rank != null ? rank.hashCode() : 0);
        return result;
    }

    @Override
    public int compareTo(EditorFormFieldTarget otherEditorFormFieldTarget) {
        int result = 0;
        if (this.sectionName == null) {
            if (otherEditorFormFieldTarget.sectionName != null) {
                return -1;
            }
        } else {
            result = this.sectionName.compareTo(otherEditorFormFieldTarget.sectionName);
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
        return "EditorFormFieldTarget{" + "name='" + sectionName + '\'' + ", rank=" + rank + '}';
    }
}
