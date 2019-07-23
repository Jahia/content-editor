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

import java.util.Arrays;
import java.util.Collections;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.junit.Assert.*;

/**
 * Tests for {@link EditorFormFieldSet}
 */
public final class EditorFormFieldSetTest {

    @Test
    public void mergeWithReturnsThisUnmodifiedWhenNodeTypeDoesNotMatch() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form1").build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form2").build();

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertSame(form1, result);
        assertEquals(new EditorFormFieldSet("form1", Collections.emptyList()), result);
    }

    @Test
    public void mergeWithCanOverrideAnyUnsetProperty() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form").build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form")
                .withPriority(1d)
                .withFields(new EditorFormFieldBuilder("x").build())
                .build();

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertNotSame(form1, result);
        assertNotSame(form2, result);
        assertEquals(Double.valueOf(1d), result.getPriority());
        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
    }

    @Test
    public void mergeWithCannotUnsetProperties() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form")
                .withPriority(1d)
                .withFields(new EditorFormFieldBuilder("x").build())
                .build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form").build();

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertNotSame(form1, result);
        assertNotSame(form2, result);
        assertEquals(Double.valueOf(1d), result.getPriority());
        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
    }

    @Test
    public void mergeWithCanOverridePriority() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form").withPriority(1d).build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form").withPriority(2d).build();

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertEquals(Double.valueOf(2d), result.getPriority());
    }

    @Test
    public void mergeWithDoesNotRetainRemovedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", Arrays.asList(
                new EditorFormFieldBuilder("x").removed(true).build(),
                new EditorFormFieldBuilder("y").build()
        ));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build(),
                new EditorFormFieldBuilder("z").build()
        ));

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("z").build()
        ));
    }

    @Test
    public void mergeWithDoesNotAddRemovedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", Arrays.asList(
                new EditorFormFieldBuilder("x").build()
        ));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build()
        ));

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("x").build()
        ));
    }

}
