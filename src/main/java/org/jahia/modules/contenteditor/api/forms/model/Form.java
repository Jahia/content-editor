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

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.osgi.framework.Bundle;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Represents the definition of an editor form, including the ordering of sections
 */
public class Form implements Cloneable, Comparable<Form> {
    private ExtendedNodeType nodeType;
    private String labelKey;
    private String descriptionKey;
    private String label;
    private String description;
    private double priority = 1.;
    private List<Section> sections = new ArrayList<>();
    private Bundle originBundle;
    private Boolean hasPreview;

    public ExtendedNodeType getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeTypeName) {
        try {
            nodeType = NodeTypeRegistry.getInstance().getNodeType(nodeTypeName);
        } catch (NoSuchNodeTypeException e) {
            throw new RuntimeException(e);
        }
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

    public double getPriority() {
        return priority;
    }

    public void setPriority(double priority) {
        this.priority = priority;
    }

    public Boolean hasPreview() {
        return hasPreview;
    }

    public void setHasPreview(Boolean hasPreview) {
        this.hasPreview = hasPreview;
    }

    public List<Section> getSections() {
        return sections;
    }

    public void setSections(List<Section> sections) {
        this.sections = sections;
    }

    @JsonIgnore
    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
    }

    public void initializeLabel(Locale uiLocale) {
        label = label == null ? nodeType.getLabel(uiLocale) : label;
        description = description == null ? nodeType.getDescription(uiLocale) : descriptionKey;
    }

    @Override
    public int compareTo(Form otherForm) {
        if (otherForm == null) {
            return -1;
        }

        if (priority != otherForm.getPriority()) {
            return Double.compare(priority, otherForm.getPriority());
        }

        final ExtendedNodeType otherNodeType = otherForm.getNodeType();
        if (!nodeType.equals(otherNodeType)) {
            if (nodeType.isNodeType(otherNodeType.getName())) {
                return 1;
            }
            if (otherNodeType.isNodeType(nodeType.getName())) {
                return -1;
            }
            // put types that not inherit to the end (as they are set as mixin to an existing node)
            return 1;
        }

        int result = 0;
        if (originBundle == null) {
            if (otherForm.originBundle != null) {
                result = -1;
            }
        } else if (otherForm.originBundle == null) {
            result = 1;
        } else {
            result = originBundle.compareTo(otherForm.originBundle);
        }
        return result;
    }

    public Form clone() {
        try {
            Form newForm = (Form) super.clone();
            if (sections != null) {
                newForm.setSections(sections.stream().map(Section::clone).collect(Collectors.toList()));
            }
            return newForm;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }

    public void mergeWith(Form otherForm) {
        setHasPreview(otherForm.hasPreview() != null ? otherForm.hasPreview() : hasPreview);
        mergeSections(otherForm.getSections());
    }

    private void mergeSections(List<Section> otherSections) {
        for (Section otherSection : otherSections) {
            Section mergedSection = sections.stream().filter(section -> section.getName().equals(otherSection.getName())).findFirst().orElseGet(Section::new);
            mergedSection.mergeWith(otherSection, this);
            if (!sections.contains(mergedSection)) {
                sections.add(mergedSection);
            }
        }
        Collections.sort(sections);
    }

    public Optional<Field> findAndRemoveField(Field otherField) {
        return sections.stream().flatMap(section ->
            section.getFieldSets().stream().flatMap(fieldSet -> {
                Optional<Field> foundField = fieldSet.getFields().stream().filter(field -> otherField.getExtendedPropertyDefinition() != null ? field.getKey().equals(otherField.getKey()) : field.getName().equals(otherField.getName())).findFirst();
                if (foundField.isPresent()) {
                    fieldSet.getFields().remove(foundField.get());
                    return Stream.of(foundField.get());
                }
                return Stream.of();
        })).findFirst();
    }
}
