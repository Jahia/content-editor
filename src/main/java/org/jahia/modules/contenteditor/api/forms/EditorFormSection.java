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

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a logical section of field sets.
 */
public class EditorFormSection {

    private String name;
    List<EditorFormFieldSet> fieldSets = new ArrayList<>();
    private String displayName;
    private Double rank;
    private Double priority;
    private String description;
    private boolean hide = false;
    private boolean expanded;

    public EditorFormSection() {
    }

    public EditorFormSection(String name, String displayName, String description, Double rank, Double priority, List<EditorFormFieldSet> fieldSets, boolean expanded) {
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.rank = rank;
        this.priority = priority;
        this.fieldSets = fieldSets;
        this.expanded = expanded;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the name (aka identifier) of the section")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the displayable name of the section")
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    @GraphQLField
    @GraphQLDescription("Returns the description of the section")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
    @GraphQLName("hide")
    @GraphQLDescription("Check if this section should be hide")
    public boolean isHide() {
        return hide;
    }

    public void setHide(boolean hide) {
        this.hide = hide;
    }

    @GraphQLField
    @GraphQLName("fieldSets")
    @GraphQLDescription("Returns the field sets contained in this section")
    public List<EditorFormFieldSet> getFieldSets() {
        return fieldSets;
    }

    public void setFieldSets(List<EditorFormFieldSet> fieldSets) {
        this.fieldSets = fieldSets;
    }

    @GraphQLField
    @GraphQLName("expanded")
    @GraphQLDescription("Is the section expanded")
    public boolean expanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    /**
     *
     * @param fieldSetName name of field set to look for in this section
     * @return EditorFormFieldSet that matches given name, or null if not found.
     */
    public EditorFormFieldSet getFieldSetByName(String fieldSetName) {
        if (fieldSetName == null || fieldSetName.isEmpty()) {
            return null;
        }

        return getFieldSets().stream()
            .filter(fs -> fs.getName().equals(fieldSetName))
            .findFirst()
            .orElse(null);
    }
}
