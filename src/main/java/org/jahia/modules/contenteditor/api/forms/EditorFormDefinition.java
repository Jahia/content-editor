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

import graphql.annotations.annotationTypes.GraphQLField;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.osgi.framework.Bundle;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Represents the definition of an editor form, including the ordering of sections
 */
public class EditorFormDefinition implements Comparable<EditorFormDefinition> {

    private String nodeType;
    private Double priority;
    private List<EditorFormSectionDefinition> sections;
    private Bundle originBundle;
    private Boolean hasPreview;

    public EditorFormDefinition() {
        sections = null;
    }

    public EditorFormDefinition(String nodeType, Double priority, Boolean hasPreview, List<EditorFormSectionDefinition> sections,
        Bundle originBundle) {
        this.nodeType = nodeType;
        this.priority = priority;
        this.sections = sections;
        this.originBundle = originBundle;
        this.hasPreview = hasPreview;
    }

    @GraphQLField
    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    @GraphQLField
    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    @GraphQLField
    public Boolean hasPreview() {
        return hasPreview;
    }

    public void setHasPreview(Boolean hasPreview) {
        this.hasPreview = hasPreview;
    }

    @GraphQLField
    public List<EditorFormSectionDefinition> getSections() {
        return sections;
    }

    public void setSections(List<EditorFormSectionDefinition> sections) {
        this.sections = sections;
    }

    @GraphQLField
    public String getOriginBundleSymbolicName() {
        return originBundle != null ? originBundle.getSymbolicName() : null;
    }

    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
    }

    @Override
    public int compareTo(EditorFormDefinition otherEditorFormDefinition) {
        if (otherEditorFormDefinition == null) {
            return -1;
        }
        final String otherName = otherEditorFormDefinition.getNodeType();
        try {
            ExtendedNodeType extendedNodeType = NodeTypeRegistry.getInstance().getNodeType(this.nodeType);
            ExtendedNodeType otherNodeType = NodeTypeRegistry.getInstance().getNodeType(otherName);
            if (!extendedNodeType.equals(otherNodeType)) {
                if (extendedNodeType.isNodeType(otherNodeType.getName())) {
                    return 1;
                }
                if (otherNodeType.isNodeType(extendedNodeType.getName())) {
                    return -1;
                }
                // put types that not inherit to the end (as they are set as mixin to an existing node)
                return 1;
            }
        } catch (NoSuchNodeTypeException e) {
            throw new EditorFormRuntimeException(String.format("unable to resolve one of the types %s and %s", this.nodeType, otherName),
                e);
        }

        int result = 0;
        if (priority == null) {
            if (otherEditorFormDefinition.priority != null) {
                result = -1;
            }
        } else if (otherEditorFormDefinition.priority == null) {
            result = 1;
        } else {
            result = priority.compareTo(otherEditorFormDefinition.priority);
        }

        if (result != 0) {
            return result;
        }

        if (originBundle == null) {
            if (otherEditorFormDefinition.originBundle != null) {
                result = -1;
            }
        } else if (otherEditorFormDefinition.originBundle == null) {
            result = 1;
        } else {
            result = originBundle.compareTo(otherEditorFormDefinition.originBundle);
        }
        return result;
    }

    public EditorFormDefinition mergeWith(EditorFormDefinition otherEditorFormDefinition) {
        return new EditorFormDefinition(nodeType, priority,
            otherEditorFormDefinition.hasPreview() != null ? otherEditorFormDefinition.hasPreview() : hasPreview,
            mergeSections(otherEditorFormDefinition.getSections()), null);
    }

    private List<EditorFormSectionDefinition> mergeSections(List<EditorFormSectionDefinition> sections) {
        List<EditorFormSectionDefinition> sectionsCopy = this.sections.stream()
            .map(EditorFormSectionDefinition::copy)
            .collect(Collectors.toCollection(LinkedList::new));

        if (sections == null) {
            return sectionsCopy;
        }

        // Prioritize insertion order of sections first then append remaining sections last
        List<EditorFormSectionDefinition> sortedSections = new ArrayList<>();
        for (EditorFormSectionDefinition newSection : sections) {

            EditorFormSectionDefinition sectionDef = null;
            for (Iterator<EditorFormSectionDefinition> iter = sectionsCopy.iterator(); iter.hasNext();) {
                EditorFormSectionDefinition e = iter.next();
                if (e.getName().equals(newSection.getName())) {
                    sectionDef = e;
                    iter.remove();
                    break;
                }
            }

            if (sectionDef == null) {
                sectionDef = newSection.copy();
            } else {
                sectionDef.mergeWith(newSection);
            }
            sortedSections.add(sectionDef);
        }

        sortedSections.addAll(sectionsCopy);
        return sortedSections;
    }

}
