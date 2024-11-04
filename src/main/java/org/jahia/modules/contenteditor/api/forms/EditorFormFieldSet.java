/*
 * MIT License
 *
 * Copyright (c) 2002 - 2022 Jahia Solutions Group. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
    private String name;
    private String displayName;
    private String description;
    private Bundle originBundle;
    private Double rank = 0.0;
    private Double priority = 1.0;
    private Boolean removed = false;
    private Boolean dynamic = false;
    private Boolean activated = true; // this is only used when dynamic is true
    private Boolean displayed = true;
    private Boolean readOnly;
    private Set<EditorFormField> editorFormFields = new HashSet<>();
    private Map<String, EditorFormField> editorFormFieldsByName = new LinkedHashMap<>();
    private EditorFormFieldTarget target = new EditorFormFieldTarget();

    public EditorFormFieldSet() {
    }

    public EditorFormFieldSet(String name,
                              String displayName,
                              String description,
                              Boolean removed,
                              Boolean dynamic,
                              Boolean activated,
                              Boolean displayed,
                              Boolean readOnly,
                              Set<EditorFormField> editorFormFields) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.removed = removed;
        this.dynamic = dynamic;
        this.activated = activated;
        this.displayed = displayed;
        this.readOnly = readOnly;
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

    public Boolean getRemoved() {
        return removed;
    }

    public void setRemoved(Boolean removed) {
        this.removed = removed;
    }

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

    @GraphQLField
    @GraphQLDescription("Defines if the field has to be displayed or not")
    public Boolean getDisplayed() {
        return displayed;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the fieldset is readonly. This could be due to locks or permissions")
    public Boolean getReadOnly() {
        return readOnly;
    }

    public void setDisplayed(Boolean displayed) {
        this.displayed = displayed;
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
        return Objects.equals(name, that.name) && Objects.equals(originBundle, that.originBundle) && Objects.equals(rank, that.rank) && Objects.equals(priority, that.priority);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, originBundle, rank, priority);
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
            if (otherEditorFormFieldSet.priority != null) {
                return -1;
            } else {
                return otherEditorFormFieldSet.hashCode() - this.hashCode();
            }
        } else {
            if (otherEditorFormFieldSet.priority == null) {
                return 1;
            } else {
                int comparePriority = priority.compareTo(otherEditorFormFieldSet.priority);
                if (comparePriority == 0) {
                    return otherEditorFormFieldSet.hashCode() - this.hashCode();
                } else {
                    return comparePriority;
                }
            }
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
     * @param processedProperties     Set of property names already existing in current form (to avoid property conflict)
     * @return the resulting merged object.
     */
    public EditorFormFieldSet mergeWith(EditorFormFieldSet otherEditorFormFieldSet, Set<String> processedProperties) {
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
                if (editorFormFieldsByName.get(otherEditorFormField.getName()) == null && !otherEditorFormField.isRemoved() && !processedProperties.contains(otherEditorFormField.getName())) {
                    mergedEditorFormFields.add(otherEditorFormField);
                }
            }
        }
        EditorFormFieldSet newEditorFormFieldSet = new EditorFormFieldSet(name,
            displayName,
            description,
            removed,
            dynamic,
            activated,
            displayed,
            readOnly,
            mergedEditorFormFields);

        if (otherEditorFormFieldSet.priority != null) {
            newEditorFormFieldSet.setPriority(otherEditorFormFieldSet.priority);
        }

        if (otherEditorFormFieldSet.rank != null) {
            newEditorFormFieldSet.setRank(otherEditorFormFieldSet.rank);
        }

        newEditorFormFieldSet.setRemoved(otherEditorFormFieldSet.isRemoved());
        if (originBundle != null) {
            newEditorFormFieldSet.setOriginBundle(getOriginBundle());
        } else {
            newEditorFormFieldSet.setOriginBundle(otherEditorFormFieldSet.getOriginBundle());
        }

        return newEditorFormFieldSet;
    }

    public EditorFormField getFieldByName(String name) {
        return editorFormFieldsByName.get(name);
    }

    public EditorFormFieldTarget getTarget() {
        return target;
    }

    public void setTarget(EditorFormFieldTarget target) {
        this.target = target;
    }
}
