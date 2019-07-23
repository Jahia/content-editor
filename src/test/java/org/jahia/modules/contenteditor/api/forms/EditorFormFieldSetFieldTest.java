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

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 * Tests for {@link EditorFormField}
 */
public final class EditorFormFieldSetFieldTest {

    @Test
    public void mergeWithReturnsThisUnmodifiedWhenNameDoesNotMatch() {
        final EditorFormField field = new EditorFormFieldBuilder("a").build();
        final EditorFormField other = createAndFillEditorFormField("b");

        EditorFormField result = field.mergeWith(other);

        assertSame(field, result);
        assertEquals(new EditorFormFieldBuilder("a").build(), result);
    }

    @Test
    public void mergeWithCanOverrideAnyUnsetProperties() {
        final EditorFormField field = new EditorFormFieldBuilder("a").build();
        final EditorFormField other = createAndFillEditorFormField("a");

        EditorFormField result = field.mergeWith(other);

        assertNotSame(field, result);
        assertNotSame(other, result);
        assertEquals(createAndFillEditorFormField("a"), result);
    }

    @Test
    public void mergeWithCannotUnsetProperties() {
        final EditorFormField field = createAndFillEditorFormField("a");
        final EditorFormField other = new EditorFormFieldBuilder("a").build();

        EditorFormField result = field.mergeWith(other);

        assertNotSame(field, result);
        assertNotSame(other, result);
        assertEquals(createAndFillEditorFormField("a"), result);
    }

    @Test
    public void mergeWithCanOverrideSelectorType() {
        final EditorFormField field = new EditorFormFieldBuilder("a")
                .withSelectorType("Text")
                .build();
        final EditorFormField other = new EditorFormFieldBuilder("a")
                .withSelectorType("RichText")
                .build();

        EditorFormField result = field.mergeWith(other);

        assertEquals("RichText", result.getSelectorType());
    }

    @Test
    public void mergeWithCanOverrideRemoved() {
        final EditorFormField removed = new EditorFormFieldBuilder("a")
                .removed(true)
                .build();
        final EditorFormField present = new EditorFormFieldBuilder("a")
                .removed(false)
                .build();

        assertEquals(false, removed.mergeWith(present).isRemoved());
        assertEquals(true, present.mergeWith(removed).isRemoved());
    }

    @Test
    public void mergeWithCanOverrideDefaultValues() {
        final EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withDefaultValues(
                        new EditorFormFieldValue(1d)
                ).build();
        final EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withDefaultValues(
                        new EditorFormFieldValue(2d),
                        new EditorFormFieldValue(3d)
                ).build();

        assertThat(field1.mergeWith(field2).getDefaultValues(), contains(
                new EditorFormFieldValue(2d),
                new EditorFormFieldValue(3d)
        ));
        assertThat(field2.mergeWith(field1).getDefaultValues(), contains(
                new EditorFormFieldValue(1d)
        ));
    }

    @Test
    public void mergeWithCanOverrideSelectorOptions() {
        final EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withSelectorOptions(
                        new EditorFormProperty("x", "x"),
                        new EditorFormProperty("y", "y")
                ).build();
        final EditorFormField field2 = new EditorFormFieldBuilder("a")
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
    public void mergeWithCanOverrideValueConstraints() {
        final EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withValueConstraints(
                        new EditorFormFieldValueConstraint("x", null, null),
                        new EditorFormFieldValueConstraint("y", null, null)
                ).build();
        final EditorFormField field2 = new EditorFormFieldBuilder("a")
                .withValueConstraints(
                        new EditorFormFieldValueConstraint("z", null, null)
                ).build();

        assertThat(field1.mergeWith(field2).getValueConstraints(), contains(
                new EditorFormFieldValueConstraint("z", null, null)
        ));
        assertThat(field2.mergeWith(field1).getValueConstraints(), contains(
                new EditorFormFieldValueConstraint("x", null, null),
                new EditorFormFieldValueConstraint("y", null, null)
        ));
    }

    @Test
    public void mergeWithCanOverrideTargets() {
        final EditorFormField field1 = new EditorFormFieldBuilder("a")
                .withTargets(
                        new EditorFormFieldTarget("x", 0d),
                        new EditorFormFieldTarget("y", 1d)
                ).build();
        final EditorFormField field2 = new EditorFormFieldBuilder("a")
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
        final EditorFormField mandatory = new EditorFormFieldBuilder("a")
                .mandatory(true)
                .build();
        final EditorFormField optional = new EditorFormFieldBuilder("a")
                .mandatory(false)
                .build();

        assertEquals(true, mandatory.mergeWith(optional).getMandatory());
        assertEquals(true, optional.mergeWith(mandatory).getMandatory());
    }

    @Test
    public void mergeWithCanOnlyOverrideReadOnlyIfNotTrue() {
        final EditorFormField readOnly = new EditorFormFieldBuilder("a")
                .readOnly(true)
                .build();
        final EditorFormField readWrite = new EditorFormFieldBuilder("a")
                .readOnly(false)
                .build();

        assertEquals(true, readOnly.mergeWith(readWrite).getReadOnly());
        assertEquals(true, readWrite.mergeWith(readOnly).getReadOnly());
    }

    @Test
    public void mergeWithCannotOverrideI18n() {
        final EditorFormField localized = new EditorFormFieldBuilder("a")
                .i18n(true)
                .build();
        final EditorFormField unlocalized = new EditorFormFieldBuilder("a")
                .i18n(false)
                .build();

        assertEquals(true, localized.mergeWith(unlocalized).getI18n());
        assertEquals(false, unlocalized.mergeWith(localized).getI18n());
    }

    @Test
    public void mergeWithCannotOverrideMultiple() {
        final EditorFormField multiple = new EditorFormFieldBuilder("a")
                .multiple(true)
                .build();
        final EditorFormField single = new EditorFormFieldBuilder("a")
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
                .withDefaultValues(new EditorFormFieldValue(true))
                .withSelectorType("MyCustomSelector")
                .withSelectorOptions(new EditorFormProperty("x", "y"))
                .withTargets(new EditorFormFieldTarget("MyTarget", 0d))
                .withValueConstraints(new EditorFormFieldValueConstraint("MyConstraint", null, null))
                .i18n(true)
                .mandatory(true)
                .multiple(true)
                .readOnly(true)
                .removed(true)
                .build();
    }

}
