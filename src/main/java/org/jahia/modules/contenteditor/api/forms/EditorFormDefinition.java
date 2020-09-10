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

import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.osgi.framework.Bundle;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.List;

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

    public EditorFormDefinition(String nodeType, Double priority, Boolean hasPreview, List<EditorFormSectionDefinition> sections, Bundle originBundle) {
        this.nodeType = nodeType;
        this.priority = priority;
        this.sections = sections;
        this.originBundle = originBundle;
        this.hasPreview = hasPreview;
    }

    public String getNodeType() {
        return nodeType;
    }

    public void setNodeType(String nodeType) {
        this.nodeType = nodeType;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    public Boolean hasPreview() {
        return hasPreview;
    }

    public void setHasPreview(Boolean hasPreview) {
        this.hasPreview = hasPreview;
    }

    public List<EditorFormSectionDefinition> getSections() {
        return sections;
    }

    public void setSections(List<EditorFormSectionDefinition> sections) {
        this.sections = sections;
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
            throw new EditorFormRuntimeException(String.format("unable to resolve one of the types %s and %s", this.nodeType, otherName), e);
        }
        if (priority == null) {
            if (otherEditorFormDefinition.priority != null) {
                return -1;
            }
            return 0;
        } else {
            if (otherEditorFormDefinition.priority == null) {
                return 1;
            }
            return priority.compareTo(otherEditorFormDefinition.priority);
        }
    }

    public EditorFormDefinition mergeWith(EditorFormDefinition otherEditorFormDefinition) {
        return new EditorFormDefinition(nodeType, priority, otherEditorFormDefinition.hasPreview() != null ? otherEditorFormDefinition.hasPreview() : hasPreview, otherEditorFormDefinition.getSections() != null ? otherEditorFormDefinition.getSections() : sections, null);
    }

}
