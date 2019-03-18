/*
 * ==========================================================================================
 * =                            JAHIA'S ENTERPRISE DISTRIBUTION                             =
 * ==========================================================================================
 *
 *                                  http://www.jahia.com
 *
 * JAHIA'S ENTERPRISE DISTRIBUTIONS LICENSING - IMPORTANT INFORMATION
 * ==========================================================================================
 *
 *     Copyright (C) 2002-2019 Jahia Solutions Group. All rights reserved.
 *
 *     This file is part of a Jahia's Enterprise Distribution.
 *
 *     Jahia's Enterprise Distributions must be used in accordance with the terms
 *     contained in the Jahia Solutions Group Terms &amp; Conditions as well as
 *     the Jahia Sustainable Enterprise License (JSEL).
 *
 *     For questions regarding licensing, support, production usage...
 *     please contact our team at sales@jahia.com or go to http://www.jahia.com/license.
 *
 * ==========================================================================================
 */
package org.jahia.modules.contenteditor.api.forms;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

final class EditorFormFieldBuilder {

    private final String name;
    private String selectorType;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private Boolean removed;
    private List<EditorFormFieldValue> defaultValues;
    private List<EditorFormFieldValueConstraint> valueConstraints;
    private List<EditorFormFieldTarget> targets;
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

    EditorFormFieldBuilder withDefaultValues(EditorFormFieldValue ...defaultValues) {
        this.defaultValues = (defaultValues.length == 0) ? null : Arrays.asList(defaultValues);
        return this;
    }

    EditorFormFieldBuilder withSelectorOptions(EditorFormProperty ...selectorOptions) {
        this.selectorOptions = (selectorOptions.length == 0) ? null : Arrays.asList(selectorOptions);
        return this;
    }

    EditorFormFieldBuilder withTargets(EditorFormFieldTarget ...targets) {
        this.targets = (targets.length == 0) ? null : Arrays.asList(targets);
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
        field.setRemoved(removed);
        field.setTargets((targets == null) ? null : targets.stream()
                .map(target -> new EditorFormFieldTarget(target))
                .collect(Collectors.toList())
        );
        return field;
    }

}
