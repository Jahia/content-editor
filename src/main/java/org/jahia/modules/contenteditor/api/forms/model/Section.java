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
package org.jahia.modules.contenteditor.api.forms.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * For the moment this object only contains a name but it is planned for the schema to evolve so we decided to use an
 * object instead of just a string.
 */
public class Section implements Cloneable, Comparable<Section> {
    private String name;
    private String labelKey;
    private String descriptionKey;
    private String label;
    private String description;
    private String requiredPermission;
    private Boolean hide;
    private Boolean expanded;
    private Double rank;
    private List<String> displayModes;
    private List<FieldSet> fieldSets = new ArrayList<>();

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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequiredPermission() {
        return requiredPermission;
    }

    public void setRequiredPermission(String requiredPermission) {
        this.requiredPermission = requiredPermission;
    }

    public Boolean isHide() {
        return hide;
    }

    public void setHide(Boolean hide) {
        this.hide = hide;
    }

    public Boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(Boolean expanded) {
        this.expanded = expanded;
    }

    public List<String> getDisplayModes() {
        return displayModes;
    }

    public void setDisplayModes(List<String> displayModes) {
        this.displayModes = displayModes;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public List<FieldSet> getFieldSets() {
        return fieldSets;
    }

    public void setFieldSets(List<FieldSet> fieldSets) {
        this.fieldSets = fieldSets;
    }

    @Override
    public int compareTo(Section other) {
        if (other == null || other.getRank() == null) {
            return -1;
        }

        if (rank == null) {
            return 1;
        }

        if (!rank.equals(other.getRank())) {
            return rank.compareTo(other.getRank());
        }
        return name.compareTo(other.getName());
    }

    public Section clone() {
        try {
            Section newSection = (Section) super.clone();
            if (displayModes != null) {
                newSection.setDisplayModes(new ArrayList<>(displayModes));
            }
            if (fieldSets != null) {
                newSection.setFieldSets(fieldSets.stream().map(FieldSet::clone).collect(Collectors.toList()));
            }
            return newSection;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }

    public void mergeWith(Section otherSection, Form form) {
        setName(name == null ? otherSection.getName() : name);

        setLabel(otherSection.getLabelKey() != null || otherSection.getLabel() != null ? otherSection.getLabel() : label);
        setLabelKey(otherSection.getLabelKey() != null || otherSection.getLabel() != null ? otherSection.getLabelKey() : labelKey);
        setDescription(otherSection.getDescriptionKey() != null || otherSection.getDescription() != null ? otherSection.getDescription() : description);
        setDescriptionKey(otherSection.getDescriptionKey() != null || otherSection.getDescription() != null ? otherSection.getDescriptionKey() : descriptionKey);
        setRequiredPermission(otherSection.getRequiredPermission() != null ? otherSection.getRequiredPermission() : requiredPermission);
        setHide(otherSection.isHide() != null ? otherSection.isHide() : hide);
        setExpanded(otherSection.isExpanded() != null ? otherSection.isExpanded() : expanded);
        setDisplayModes(otherSection.getDisplayModes() != null ? otherSection.getDisplayModes() : displayModes);
        setRank(otherSection.getRank() != null ? otherSection.getRank() : rank);
        mergeFieldSets(otherSection.getFieldSets(), form);
    }

    private void mergeFieldSets(List<FieldSet> otherFieldSets, Form form) {
        for (FieldSet otherFieldSet : otherFieldSets) {
            String key = otherFieldSet.getName().equals("<main>") ? form.getNodeType() : otherFieldSet.getName();
            FieldSet mergedFieldSet = fieldSets.stream().filter(fieldSet -> fieldSet.getName().equals(key)).findFirst().orElseGet(FieldSet::new);
            mergedFieldSet.mergeWith(otherFieldSet, form);
            if (!fieldSets.contains(mergedFieldSet)) {
                fieldSets.add(mergedFieldSet);
            }
        }
        Collections.sort(fieldSets);
    }
}
