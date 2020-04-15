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

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;

/**
 * Represents a form target (aka classification) alongside with the rank within that target.
 */
public class EditorFormFieldTarget implements Comparable<EditorFormFieldTarget> {
    private static final double THRESHOLD = .0001;
    private String sectionName;
    private String fieldSetName;
    private Double rank;

    public EditorFormFieldTarget() {
    }

    public EditorFormFieldTarget(String sectionName, String fieldSetName, Double rank) {
        this.sectionName = sectionName;
        this.fieldSetName = fieldSetName;
        this.rank = rank;
    }

    public EditorFormFieldTarget(EditorFormFieldTarget target) {
        this(target.sectionName, target.fieldSetName, target.rank);
    }

    @GraphQLField
    @GraphQLDescription("The name identifying the target")
    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    @GraphQLField
    @GraphQLDescription("The rank of the field within the target")
    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public String getFieldSetName() {
        return fieldSetName;
    }

    public void setFieldSetName(String fieldSetName) {
        this.fieldSetName = fieldSetName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EditorFormFieldTarget that = (EditorFormFieldTarget) o;

        if (sectionName != null ? !sectionName.equals(that.sectionName) : that.sectionName != null) return false;
        if (fieldSetName != null ? !fieldSetName.equals(that.fieldSetName) : that.fieldSetName != null) return false;
        return rank != null ? Math.abs(rank - that.rank) < THRESHOLD : that.rank == null;
    }

    @Override
    public int hashCode() {
        int result = sectionName != null ? sectionName.hashCode() : 0;
        result = 31 * result + (rank != null ? rank.hashCode() : 0);
        return result;
    }

    @Override
    public int compareTo(EditorFormFieldTarget otherEditorFormFieldTarget) {
        int result = 0;
        if (this.sectionName == null) {
            if (otherEditorFormFieldTarget.sectionName != null) {
                return -1;
            }
        } else {
            result = this.sectionName.compareTo(otherEditorFormFieldTarget.sectionName);
            if (result != 0) {
                return result;
            }
        }
        if (rank == null) {
            if (otherEditorFormFieldTarget.rank != null) {
                return -1;
            }
        } else {
            return rank.compareTo(otherEditorFormFieldTarget.rank);
        }
        return 0;
    }

    @Override
    public String toString() {
        return "EditorFormFieldTarget{" + "name='" + sectionName + '\'' + ", rank=" + rank + '}';
    }
}
