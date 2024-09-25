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

import java.util.ArrayList;
import java.util.List;

/**
 * For the moment this object only contains a name but it is planned for the schema to evolve so we decided to use an
 * object instead of just a string.
 */
public class EditorFormSectionDefinition {
    private String name;
    private String labelKey;
    private String descriptionKey;
    private String requiredPermission;
    private boolean hide = false;
    private boolean expanded;
    private List<EditorFormFieldSet> fieldSets = new ArrayList<>();

    private List<String> displayModes = new ArrayList<>();

    public EditorFormSectionDefinition() {
    }

    public EditorFormSectionDefinition(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabelKey() {
        return labelKey;
    }

    public void setLabelKey(String labelKey) {
        this.labelKey = labelKey;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }

    public void setDescriptionKey(String descriptionKey) {
        this.descriptionKey = descriptionKey;
    }

    public String getRequiredPermission() {
        return requiredPermission;
    }

    public void setRequiredPermission(String requiredPermission) {
        this.requiredPermission = requiredPermission;
    }

    public boolean isHide() {
        return hide;
    }

    public void setHide(boolean hide) {
        this.hide = hide;
    }

    public boolean expanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

    public List<String> getDisplayModes() {
        return displayModes;
    }

    public void setDisplayModes(List<String> displayModes) {
        this.displayModes = displayModes;
    }

    public List<EditorFormFieldSet> getFieldSets() {
        return fieldSets;
    }

    public void setFieldSets(List<EditorFormFieldSet> fieldSets) {
        this.fieldSets = fieldSets;
    }

    public void mergeWith(EditorFormSectionDefinition section) {
        if (section.getDescriptionKey() != null) {
            this.descriptionKey = section.getDescriptionKey();
        }

        if (section.getLabelKey() != null) {
            this.labelKey = section.getLabelKey();
        }

        if (section.getRequiredPermission() != null) {
            this.requiredPermission = section.getRequiredPermission();
        }

        this.hide = section.isHide();
        this.expanded = section.expanded();
        this.displayModes = section.getDisplayModes();
        this.fieldSets = section.getFieldSets();
    }

    public EditorFormSectionDefinition copy() {
        EditorFormSectionDefinition newSection = new EditorFormSectionDefinition();
        newSection.setName(this.name);
        newSection.setLabelKey(this.labelKey);
        newSection.setDescriptionKey(this.descriptionKey);
        newSection.setRequiredPermission(this.requiredPermission);
        newSection.setHide(this.hide);
        newSection.setExpanded(this.expanded);
        newSection.setDisplayModes(this.displayModes);
        return newSection;
    }
}
