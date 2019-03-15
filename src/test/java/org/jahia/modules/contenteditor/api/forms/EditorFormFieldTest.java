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

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;

/**
 * Test for {@link EditorFormField}
 */
public final class EditorFormFieldTest {

    @Test
    public void mergeWithReturnsThisUnmodifiedWhenNamesDiffer() {
        EditorFormField field = new EditorFormFieldBuilder("a").build();
        EditorFormField other = createAndFillEditorFormField("b");

        EditorFormField result = field.mergeWith(other);

        assertSame(field, result);
        assertEquals(new EditorFormFieldBuilder("a").build(), result);
    }

    @Test
    public void mergeWithDoesNotUnsetProperties() {
        EditorFormField field = createAndFillEditorFormField("a");
        EditorFormField other = new EditorFormFieldBuilder("a").build();

        EditorFormField result = field.mergeWith(other);

        assertNotSame(field, result);
        assertNotSame(other, result);
        assertEquals(createAndFillEditorFormField("a"), result);
    }

    @Test
    public void mergeWithCanAlwaysOverrideUnsetProperties() {
        EditorFormField field = new EditorFormFieldBuilder("a").build();
        EditorFormField other = createAndFillEditorFormField("a");

        EditorFormField result = field.mergeWith(other);

        assertNotSame(field, result);
        assertNotSame(other, result);
        assertEquals(createAndFillEditorFormField("a"), result);
    }

    @Test
    public void mergeWithCanAlwaysOverrideSelectorType() {
        EditorFormField field = new EditorFormFieldBuilder("a")
                .withSelectorType("Text")
                .build();
        EditorFormField other = new EditorFormFieldBuilder("a")
                .withSelectorType("RichText")
                .build();

        EditorFormField result = field.mergeWith(other);

        assertEquals("RichText", result.getSelectorType());
    }

    @Test
    public void mergeWithCanAlwaysOverrideRemoved() {
        EditorFormField removed = new EditorFormFieldBuilder("a")
                .removed(true)
                .build();
        EditorFormField present = new EditorFormFieldBuilder("a")
                .removed(false)
                .build();

        assertEquals(false, removed.mergeWith(present).isRemoved());
        assertEquals(true, present.mergeWith(removed).isRemoved());
    }

    @Test
    public void mergeWithCanAlwaysOverrideDefaultValues() {
        EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withDefaultValues(
                        new EditorFormFieldValue("String", "x")
                ).build();
        EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withDefaultValues(
                        new EditorFormFieldValue("String", "y"),
                        new EditorFormFieldValue("String", "z")
                ).build();

        assertThat(field1.mergeWith(field2).getDefaultValues(), contains(
                new EditorFormFieldValue("String", "y"),
                new EditorFormFieldValue("String", "z")
        ));
        assertThat(field2.mergeWith(field1).getDefaultValues(), contains(
                new EditorFormFieldValue("String", "x")
        ));
    }

    @Test
    public void mergeWithCanAlwaysOverrideSelectorOptions() {
        EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withSelectorOptions(
                        new EditorFormProperty("x", "x"),
                        new EditorFormProperty("y", "y")
                ).build();
        EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withSelectorOptions(
                        new EditorFormProperty("z", "z")
                ).build();

        assertThat(field1.mergeWith(field2).getSelectorOptions(), contains(
                new EditorFormProperty("z", "z")
        ));
        assertThat(field2.mergeWith(field1).getSelectorOptions(), contains(
                new EditorFormProperty("x", "x"),
                new EditorFormProperty("y", "y")
        ));
    }

    @Test
    public void mergeWithCanAlwaysOverrideValueConstraints() {
        EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withValueConstraints(
                        newValueConstraint("x"),
                        newValueConstraint("y")
                ).build();
        EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withValueConstraints(
                        newValueConstraint("z")
                ).build();

        assertThat(field1.mergeWith(field2).getValueConstraints(), contains(
                newValueConstraint("z")
        ));
        assertThat(field2.mergeWith(field1).getValueConstraints(), contains(
                newValueConstraint("x"),
                newValueConstraint("y")
        ));
    }

    @Test
    public void mergeWithCanAlwaysOverrideTargets() {
        EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withTargets(
                        new EditorFormFieldTarget("x", 0d),
                        new EditorFormFieldTarget("y", 1d)
                ).build();
        EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withTargets(
                        new EditorFormFieldTarget("x", 2d),
                        new EditorFormFieldTarget("z", 3d)
                ).build();

        assertThat(field1.mergeWith(field2).getTargets(), containsInAnyOrder(
                new EditorFormFieldTarget("x", 2d),
                new EditorFormFieldTarget("y", 1d),
                new EditorFormFieldTarget("z", 3d)
        ));
        assertThat(field2.mergeWith(field1).getTargets(), containsInAnyOrder(
                new EditorFormFieldTarget("x", 0d),
                new EditorFormFieldTarget("y", 1d),
                new EditorFormFieldTarget("z", 3d)
        ));
    }

    @Test
    public void mergeWithCanOnlyOverrideMandatoryIfNotTrue() {
        EditorFormField mandatory = new EditorFormFieldBuilder("a")
                .mandatory(true)
                .build();
        EditorFormField optional = new EditorFormFieldBuilder("a")
                .mandatory(false)
                .build();

        assertEquals(true, mandatory.mergeWith(optional).getMandatory());
        assertEquals(true, optional.mergeWith(mandatory).getMandatory());
    }

    @Test
    public void mergeWithCanOnlyOverrideReadOnlyIfNotTrue() {
        EditorFormField readOnly = new EditorFormFieldBuilder("a")
                .readOnly(true)
                .build();
        EditorFormField readWrite = new EditorFormFieldBuilder("a")
                .readOnly(false)
                .build();

        assertEquals(true, readOnly.mergeWith(readWrite).getReadOnly());
        assertEquals(true, readWrite.mergeWith(readOnly).getReadOnly());
    }

    @Test
    public void mergeWithCannotOverrideI18n() {
        EditorFormField localized = new EditorFormFieldBuilder("a")
                .i18n(true)
                .build();
        EditorFormField unlocalized = new EditorFormFieldBuilder("a")
                .i18n(false)
                .build();

        assertEquals(true, localized.mergeWith(unlocalized).getI18n());
        assertEquals(false, unlocalized.mergeWith(localized).getI18n());
    }

    @Test
    public void mergeWithCannotOverrideMultiple() {
        EditorFormField multiple = new EditorFormFieldBuilder("a")
                .multiple(true)
                .build();
        EditorFormField single = new EditorFormFieldBuilder("a")
                .multiple(false)
                .build();

        assertEquals(true, multiple.mergeWith(single).getMultiple());
        assertEquals(false, single.mergeWith(multiple).getMultiple());
    }

    /*
     * Returns a new EditorFormField with the given name and all properties populated with some data.
     */
    private static EditorFormField createAndFillEditorFormField(String name) {
        return new EditorFormFieldBuilder(name)
                .withDefaultValues(new EditorFormFieldValue("String", "x"))
                .withSelectorType("MyCustomSelector")
                .withSelectorOptions(new EditorFormProperty())
                .withTargets(new EditorFormFieldTarget("MyTarget", 0d))
                .withValueConstraints(new EditorFormFieldValueConstraint())
                .i18n(true)
                .mandatory(true)
                .multiple(true)
                .readOnly(true)
                .removed(true)
                .build();
    }

    private static EditorFormFieldValueConstraint newValueConstraint(String displayName) {
        return new EditorFormFieldValueConstraint(displayName, null, null);
    }

    private static class EditorFormFieldBuilder {

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
            List<EditorFormFieldValue> defaultValues = (this.defaultValues == null) ? null : new ArrayList<>(this.defaultValues);
            List<EditorFormProperty> selectorOptions = (this.selectorOptions == null) ? null :
                    this.selectorOptions.stream()
                            .map(option -> new EditorFormProperty(option.getName(), option.getValue()))
                            .collect(Collectors.toList());
            List<EditorFormFieldTarget> targets = (this.targets == null) ? null :
                    this.targets.stream()
                            .map(target -> new EditorFormFieldTarget(target.getName(), target.getRank()))
                            .collect(Collectors.toList());
            List<EditorFormFieldValueConstraint> valueConstraints = (this.valueConstraints == null) ? null :
                    this.valueConstraints.stream()
                            .map(constraint -> new EditorFormFieldValueConstraint(
                                    constraint.getDisplayValue(),
                                    constraint.getValue(), // FIXME copy
                                    constraint.getPropertyList()) // FIXME deep copy
                            )
                            .collect(Collectors.toList());

            return new EditorFormField(
                    name, selectorType, selectorOptions, i18n, readOnly, multiple, mandatory,
                    valueConstraints, defaultValues, removed, targets, null
            );
        }
    }

}
