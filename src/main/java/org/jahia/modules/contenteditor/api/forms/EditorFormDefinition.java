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

import org.osgi.framework.Bundle;

import java.util.List;

/**
 * Represents the definition of an editor form, including the ordering of sections
 */
public class EditorFormDefinition implements Comparable<EditorFormDefinition> {

    private String name; // the "default" name is reserved to provide a default configuration
    private Double priority;
    private List<EditorFormSectionDefinition> sections;
    private Bundle originBundle;

    public EditorFormDefinition() {
    }

    public EditorFormDefinition(String name, Double priority, List<EditorFormSectionDefinition> sections, Bundle originBundle) {
        this.name = name;
        this.priority = priority;
        this.sections = sections;
        this.originBundle = originBundle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
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
        int compareName = name.compareTo(otherEditorFormDefinition.name);
        if (compareName != 0) {
            return compareName;
        }
        if (priority == null) {
            if (otherEditorFormDefinition.priority != null) return -1;
            else return 0;
        } else {
            if (otherEditorFormDefinition.priority == null) return 1;
            return priority.compareTo(otherEditorFormDefinition.priority);
        }
    }

    public EditorFormDefinition mergeWith(EditorFormDefinition otherEditorFormDefinition) {
        if (!name.equals(otherEditorFormDefinition.name)) {
            // names are not equal, we won't merge anything.
            return this;
        }
        return new EditorFormDefinition(name, priority, otherEditorFormDefinition.sections != null ? otherEditorFormDefinition.sections : sections, null);
    }

}
