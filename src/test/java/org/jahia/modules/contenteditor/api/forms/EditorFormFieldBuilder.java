/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2019 Jahia Solutions Group SA. All rights reserved.
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
