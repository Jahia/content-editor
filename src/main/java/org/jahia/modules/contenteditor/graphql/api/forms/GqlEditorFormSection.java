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
package org.jahia.modules.contenteditor.graphql.api.forms;

import graphql.annotations.annotationTypes.GraphQLDescription;
import graphql.annotations.annotationTypes.GraphQLField;
import graphql.annotations.annotationTypes.GraphQLName;
import org.jahia.modules.contenteditor.api.forms.model.Section;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Represents a logical section of field sets.
 */
public class GqlEditorFormSection {
    private Section section;

    public GqlEditorFormSection(Section section) {
        this.section = section;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the name (aka identifier) of the section")
    public String getName() {
        return section.getName();
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the displayable name of the section")
    public String getDisplayName() {
        return section.getLabel();
    }

    @GraphQLField
    @GraphQLDescription("Returns the description of the section")
    public String getDescription() {
        return section.getDescription();
    }

    @GraphQLField
    @GraphQLName("fieldSets")
    @GraphQLDescription("Returns the field sets contained in this section")
    public List<GqlEditorFormFieldSet> getFieldSets() {
        return section.getFieldSets().stream().map(GqlEditorFormFieldSet::new).collect(Collectors.toList());
    }

    @GraphQLField
    @GraphQLName("expanded")
    @GraphQLDescription("Is the section expanded")
    public boolean expanded() {
        return section.isExpanded() != null && section.isExpanded();
    }

    @GraphQLField
    @GraphQLDescription("")
    public boolean isVisible() {
        return section.isVisible();
    }
}
