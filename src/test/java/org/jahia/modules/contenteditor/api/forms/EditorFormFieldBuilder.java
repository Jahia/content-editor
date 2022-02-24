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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

final class EditorFormFieldBuilder {

    private final String name;
    private String displayName;
    private String description;
    private String selectorType;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private Boolean removed;
    private List<EditorFormFieldValue> defaultValues;
    private List<EditorFormFieldValue> currentValues;
    private List<EditorFormFieldValueConstraint> valueConstraints;
    private EditorFormFieldTarget target;
    private List<EditorFormProperty> selectorOptions;

    EditorFormFieldBuilder(String name) {
        this.name = name;
    }

    EditorFormFieldBuilder withSelectorType(String selectorType) {
        this.selectorType = selectorType;
        return this;
    }

    EditorFormFieldBuilder i18n(Boolean i18n) {
        this.i18n = i18n;
        return this;
    }

    EditorFormFieldBuilder readOnly(Boolean readOnly) {
        this.readOnly = readOnly;
        return this;
    }

    EditorFormFieldBuilder multiple(Boolean multiple) {
        this.multiple = multiple;
        return this;
    }

    EditorFormFieldBuilder mandatory(Boolean mandatory) {
        this.mandatory = mandatory;
        return this;
    }

    EditorFormFieldBuilder removed(Boolean removed) {
        this.removed = removed;
        return this;
    }

    EditorFormFieldBuilder target(EditorFormFieldTarget target) {
        this.target = target;
        return this;
    }

    EditorFormFieldBuilder withDefaultValues(EditorFormFieldValue ...defaultValues) {
        this.defaultValues = (defaultValues.length == 0) ? null : Arrays.asList(defaultValues);
        return this;
    }

    EditorFormFieldBuilder withCurrentValues(EditorFormFieldValue... currentValues) {
        this.currentValues = (currentValues.length == 0) ? null : Arrays.asList(currentValues);
        return this;
    }

    EditorFormFieldBuilder withSelectorOptions(EditorFormProperty ...selectorOptions) {
        this.selectorOptions = (selectorOptions.length == 0) ? null : Arrays.asList(selectorOptions);
        return this;
    }

    EditorFormFieldBuilder withValueConstraints(EditorFormFieldValueConstraint ...valueConstraints) {
        this.valueConstraints = (valueConstraints.length == 0) ? null : Arrays.asList(valueConstraints);
        return this;
    }

    EditorFormField build() {
        EditorFormField field = new EditorFormField();
        field.setName(name);
        field.setSelectorType(selectorType);
        field.setSelectorOptions((selectorOptions == null) ? null : selectorOptions.stream()
                .map(option -> new EditorFormProperty(option))
                .collect(Collectors.toList())
        );
        field.setI18n(i18n);
        field.setReadOnly(readOnly);
        field.setMultiple(multiple);
        field.setMandatory(mandatory);
        field.setValueConstraints((valueConstraints == null) ? null : valueConstraints.stream()
                .map(constraint -> new EditorFormFieldValueConstraint(constraint))
                .collect(Collectors.toList())
        );
        field.setDefaultValues((defaultValues == null) ? null : new ArrayList<>(defaultValues));
        field.setCurrentValues((currentValues == null) ? null : new ArrayList<>(currentValues));
        field.setRemoved(removed);
        field.setTarget(target);
        return field;
    }

}
