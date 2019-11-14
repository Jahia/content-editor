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

import org.junit.Test;

import static org.hamcrest.Matchers.contains;
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

    /*
     * Returns a new EditorFormField with the given name and all properties populated with some data.
     */
    private static EditorFormField createAndFillEditorFormField(String name) {
        return new EditorFormFieldBuilder(name)
            .withDefaultValues(new EditorFormFieldValue(true))
            .withSelectorType("MyCustomSelector")
            .withSelectorOptions(new EditorFormProperty("x", "y"))
            .target(new EditorFormFieldTarget("MySection", "MyFieldSet", 0d))
            .withValueConstraints(new EditorFormFieldValueConstraint("MyConstraint", null, null))
            .i18n(true)
            .mandatory(true)
            .multiple(true)
            .readOnly(true)
            .removed(true)
            .build();
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

    @Test
    public void mergeWithCanOverrideTargets() {
        final EditorFormField field1 = new EditorFormFieldBuilder("a")
            .target(new EditorFormFieldTarget("x", "m1", 0d))
                .build();
        final EditorFormField field2 = new EditorFormFieldBuilder("a")
            .target(new EditorFormFieldTarget("y", "m2", 1d))
            .build();

        assertEquals("Result of field target merge is incorrect",
            new EditorFormFieldTarget("y", "m2", 1d),
            field1.mergeWith(field2).getTarget());
        assertEquals("Result of field target merge is incorrect",
            new EditorFormFieldTarget("x", "m1", 0d),
            field2.mergeWith(field1).getTarget()
        );
    }

}
