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
import org.jahia.modules.contenteditor.api.forms.model.FieldSet;

import java.util.*;
import java.util.stream.Collectors;

/**
 * This structure represents a logical set of fields
 */
public class GqlEditorFormFieldSet {
    private FieldSet fieldSet;

    public GqlEditorFormFieldSet(FieldSet fieldSet) {
        this.fieldSet = fieldSet;
    }

    @GraphQLField
    @GraphQLDescription("Get the name of the field set")
    public String getName() {
        return fieldSet.getName();
    }

    @GraphQLField
    @GraphQLDescription("Get the internationalized displayable name of the field set")
    public String getDisplayName() {
        return fieldSet.getLabel();
    }

    @GraphQLField
    @GraphQLDescription("Get the internationalized description of the field set")
    public String getDescription() {
        return fieldSet.getDescription();
    }

    @GraphQLField
    @GraphQLDescription("True if this is dynamic field set (meaning it can be activated or not)")
    public Boolean getDynamic() {
        return fieldSet.isDynamic();
    }

    @GraphQLField
    @GraphQLDescription("Only used in the case of a dynamic field set. Set to true if it is activated")
    public Boolean getActivated() {
        return fieldSet.isActivated();
    }

    @GraphQLField
    @GraphQLDescription("Only used in the case of a dynamic field set. Set to true if it is activated")
    public Boolean getHasEnableSwitch() {
        return fieldSet.isHasEnableSwitch();
    }

    @GraphQLField
    @GraphQLDescription("This value is true if the fieldset is readonly. This could be due to locks or permissions")
    public boolean getReadOnly() {
        return fieldSet.isReadOnly() != null && fieldSet.isReadOnly();
    }

    @GraphQLField
    @GraphQLName("fields")
    @GraphQLDescription("Get the fields contained in the target")
    public List<GqlEditorFormField> getEditorFormFields() {
        return fieldSet.getFields().stream().map(GqlEditorFormField::new).collect(Collectors.toList());
    }

    @GraphQLField
    @GraphQLDescription("")
    public boolean isVisible() {
        return fieldSet.isVisible();
    }

}
