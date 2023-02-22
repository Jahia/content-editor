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

import java.util.Objects;

/**
 * Represents a form target (aka classification) alongside with the rank within that target.
 */
public class EditorFormFieldTarget implements Comparable<EditorFormFieldTarget> {
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
        return Objects.equals(sectionName, that.sectionName) && Objects.equals(fieldSetName, that.fieldSetName) && Objects.equals(rank, that.rank);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sectionName, fieldSetName, rank);
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
