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
import org.jahia.modules.contenteditor.api.forms.model.Form;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * An editor form represents the complete structure that is used to edit a primary node type. It contains an ordered
 * list of sections that contain the sub-structured data
 */
public class GqlEditorForm {

    private Form form;

    public GqlEditorForm(Form form) {
        this.form = form;
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the name (aka identifier) of the form")
    public String getName() {
        return form.getNodeType().getName();
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the displayable name of the form (in a specific language)")
    public String getDisplayName() {
        return form.getLabel();
    }

    @GraphQLField
    @GraphQLDescription("Retrieve a description text for the form, might contain explanations on how to use the form")
    public String getDescription() {
        return form.getDescription();
    }

    @GraphQLField
    @GraphQLDescription("Retrieve the sections that make up the form")
    public List<GqlEditorFormSection> getSections() {
        return form.getSections().stream().map(GqlEditorFormSection::new).collect(Collectors.toList());
    }

    @GraphQLField
    @GraphQLDescription("Returns the preview status of the form. If true, the form can display a preview.")
    public boolean hasPreview() {
        return form.hasPreview() != null && form.hasPreview();
    }

}
