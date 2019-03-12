package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.osgi.framework.Bundle;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * This is the root class for the editor form structure.
 */
public class EditorForm implements Comparable<EditorForm> {
    private String nodeType;
    private Collection<EditorFormTarget> editorFormTargets;
    private Map<String,EditorFormTarget> editorFormTargetsByName = new LinkedHashMap<>();
    private Bundle originBundle;
    private Double priority;

    public EditorForm() {
    }

    public EditorForm(String nodeType, Collection<EditorFormTarget> editorFormTargets) {
        this.nodeType = nodeType;
        setEditorFormTargets(editorFormTargets);
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    @GraphQLField
    @GraphQLDescription("Get the associated node type name")
    public String getNodeType() {
        return nodeType;
    }

    @GraphQLField
    @GraphQLName("targets")
    @GraphQLDescription("List of editor form targets, ie groupings of editor form fields")
    @JsonProperty("targets")
    public Collection<EditorFormTarget> getEditorFormTargets() {
        return editorFormTargets;
    }

    public void setEditorFormTargets(Collection<EditorFormTarget> editorFormTargets) {
        this.editorFormTargets = editorFormTargets;
        editorFormTargetsByName.clear();
        for (EditorFormTarget editorFormTarget : editorFormTargets) {
            editorFormTargetsByName.put(editorFormTarget.getName(), editorFormTarget);
        }
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
     * @return the resulting merged object, or null if the nodetypes didn't match.
     */
    public EditorForm mergeWith(EditorForm otherEditorForm) {
        if (!nodeType.equals(otherEditorForm.nodeType)) {
            // nodetypes are not equal, we won't merge anything.
            return this;
        }
        Collection<EditorFormTarget> mergedEditorFormTargets = new ArrayList<>();
        for (EditorFormTarget editorFormTarget : editorFormTargets) {
            EditorFormTarget otherEditorFormTarget = otherEditorForm.editorFormTargetsByName.get(editorFormTarget.getName());
            if (otherEditorFormTarget == null) {
                mergedEditorFormTargets.add(editorFormTarget);
            }
            // we now have equivalent targets, we need to merge them.
            EditorFormTarget mergedEditorFormTarget = editorFormTarget.mergeWith(otherEditorFormTarget);
            if (mergedEditorFormTarget != null) {
                mergedEditorFormTargets.add(mergedEditorFormTarget);
            }
        }
        // we now need to add all the targets that only exist in the other editor form but not in ours.
        for (EditorFormTarget otherEditorFormTarget : otherEditorForm.editorFormTargets) {
            EditorFormTarget editorFormTarget = editorFormTargetsByName.get(otherEditorFormTarget.getName());
            if (editorFormTarget == null) {
                mergedEditorFormTargets.add(otherEditorFormTarget);
            }
        }
        EditorForm newEditorForm = new EditorForm(nodeType, mergedEditorFormTargets);
        if (otherEditorForm.priority != null) {
            newEditorForm.setPriority(otherEditorForm.priority);
        }
        return newEditorForm;
    }

}
