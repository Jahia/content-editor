/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
 *
 *     THIS FILE IS AVAILABLE UNDER TWO DIFFERENT LICENSES:
 *     1/GPL OR 2/JSEL
 *
 *     1/ GPL
 *     ==================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE GPL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 *     2/ JSEL - Commercial and Supported Versions of the program
 *     ===================================================================================
 *
 *     IF YOU DECIDE TO CHOOSE THE JSEL LICENSE, YOU MUST COMPLY WITH THE FOLLOWING TERMS:
 *
 *     Alternatively, commercial and supported versions of the program - also known as
 *     Enterprise Distributions - must be used in accordance with the terms and conditions
 *     contained in a separate written agreement between you and Jahia Solutions Group SA.
 *
 *     If you are unsure which license is appropriate for your use,
 *     please contact the sales department at sales@jahia.com.
 */
package org.jahia.modules.contenteditor.api.forms;

import com.fasterxml.jackson.annotation.JsonProperty;
import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.osgi.framework.Bundle;

import java.util.*;

/**
 * This structure represents a logical set of fields
 */
public class EditorFormFieldSet implements Comparable<EditorFormFieldSet> {
    private static final double THRESHOLD = .0001;
    private String name;
    private String displayName;
    private String description;
    private Bundle originBundle;
    private Double rank = null;
    private Double priority = 1.0;
    private Boolean removed = false;
    private Boolean dynamic = false;
    private Boolean activated = true; // this is only used when dynamic is true
    private Set<EditorFormField> editorFormFields = new HashSet<>();
    private Map<String, EditorFormField> editorFormFieldsByName = new LinkedHashMap<>();

    public EditorFormFieldSet() {
    }

    public EditorFormFieldSet(String name,
                              String displayName,
                              String description,
                              Double rank,
                              Double priority,
                              Boolean removed,
                              Boolean dynamic,
                              Boolean activated,
                              Set<EditorFormField> editorFormFields) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.rank = rank;
        this.priority = priority;
        this.removed = removed;
        this.dynamic = dynamic;
        this.activated = activated;
        setEditorFormFields(editorFormFields);
    }

    @GraphQLField
    @GraphQLDescription("Get the name of the field set")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("Get the internationalized displayable name of the field set")
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @GraphQLField
    @GraphQLDescription("Get the internationalized description of the field set")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getRemoved() { return removed; }

    public void setRemoved(Boolean removed) { this.removed = removed; }

    @GraphQLField
    @GraphQLDescription("True if this is dynamic field set (meaningin it can be activated or not)")
    public Boolean getDynamic() {
        return dynamic;
    }

    public void setDynamic(Boolean dynamic) {
        this.dynamic = dynamic;
    }

    @GraphQLField
    @GraphQLDescription("Only used in the case of a dynamic field set. Set to true if it is activated")
    public Boolean getActivated() {
        return activated;
    }

    public void setActivated(Boolean activated) {
        this.activated = activated;
    }

    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
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
    public Set<EditorFormField> getEditorFormFields() {
        return editorFormFields;
    }

    public void setEditorFormFields(Set<EditorFormField> editorFormFields) {
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
        int compareName = name.compareTo(otherEditorFormFieldSet.name);
        if (compareName != 0) {
            int compareRank = rank.compareTo(otherEditorFormFieldSet.rank);
            if (compareRank == 0) {
                return compareName;
            } else {
                return compareRank;
            }
        }
        if (priority == null) {
            if (otherEditorFormFieldSet.priority != null) return -1;
            else return 0;
        } else {
            if (otherEditorFormFieldSet.priority == null) return 1;
            return priority.compareTo(otherEditorFormFieldSet.priority);
        }
    }

    public boolean isRemoved() {
        if (removed == null) {
            return false;
        }
        return removed;
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
        SortedSet<EditorFormField> mergedEditorFormFields = new TreeSet<>();
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
        EditorFormFieldSet newEditorFormFieldSet = new EditorFormFieldSet(name,
            displayName,
            description,
            otherEditorFormFieldSet.rank != null ? otherEditorFormFieldSet.rank : rank,
            priority,
            removed,
            dynamic,
            activated,
            mergedEditorFormFields);
        if (otherEditorFormFieldSet.priority == null) {
            newEditorFormFieldSet.setPriority(priority);
        } else {
            newEditorFormFieldSet.setPriority(otherEditorFormFieldSet.priority);
        }
        if (otherEditorFormFieldSet.isRemoved()) {
            newEditorFormFieldSet.setRemoved(true);
        }
        if (dynamic) {
            newEditorFormFieldSet.setDynamic(true);
        }
        if (activated) {
            newEditorFormFieldSet.setActivated(true);
        }
        return newEditorFormFieldSet;
    }

}
