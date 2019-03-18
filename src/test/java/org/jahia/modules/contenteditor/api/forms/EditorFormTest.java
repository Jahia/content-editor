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
 * Tests for {@link EditorForm}
 */
public final class EditorFormTest {

    @Test
    public void mergeWithReturnsThisUnmodifiedWhenNodeTypeDoesNotMatch() {
        final EditorForm form1 = new EditorFormBuilder("form1").build();
        final EditorForm form2 = new EditorFormBuilder("form2").build();

        EditorForm result = form1.mergeWith(form2);

        assertSame(form1, result);
        assertEquals(new EditorForm("form1", Collections.emptyList()), result);
    }

    @Test
    public void mergeWithCanOverrideAnyUnsetProperty() {
        final EditorForm form1 = new EditorFormBuilder("form").build();
        final EditorForm form2 = new EditorFormBuilder("form")
                .withPriority(1d)
                .withFields(new EditorFormFieldBuilder("x").build())
                .build();

        EditorForm result = form1.mergeWith(form2);

        assertNotSame(form1, result);
        assertNotSame(form2, result);
        assertEquals(Double.valueOf(1d), result.getPriority());
        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
    }

    @Test
    public void mergeWithCannotUnsetProperties() {
        final EditorForm form1 = new EditorFormBuilder("form")
                .withPriority(1d)
                .withFields(new EditorFormFieldBuilder("x").build())
                .build();
        final EditorForm form2 = new EditorFormBuilder("form").build();

        EditorForm result = form1.mergeWith(form2);

        assertNotSame(form1, result);
        assertNotSame(form2, result);
        assertEquals(Double.valueOf(1d), result.getPriority());
        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
    }

    @Test
    public void mergeWithCanOverridePriority() {
        final EditorForm form1 = new EditorFormBuilder("form").withPriority(1d).build();
        final EditorForm form2 = new EditorFormBuilder("form").withPriority(2d).build();

        EditorForm result = form1.mergeWith(form2);

        assertEquals(Double.valueOf(2d), result.getPriority());
    }

    @Test
    public void mergeWithDoesNotRetainRemovedFields() {
        final EditorForm form1 = new EditorForm("form", Arrays.asList(
                new EditorFormFieldBuilder("x").removed(true).build(),
                new EditorFormFieldBuilder("y").build()
        ));
        final EditorForm form2 = new EditorForm("form", Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build(),
                new EditorFormFieldBuilder("z").build()
        ));

        EditorForm result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("z").build()
        ));
    }

    @Test
    public void mergeWithDoesNotAddRemovedFields() {
        final EditorForm form1 = new EditorForm("form", Arrays.asList(
                new EditorFormFieldBuilder("x").build()
        ));
        final EditorForm form2 = new EditorForm("form", Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build()
        ));

        EditorForm result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("x").build()
        ));
    }

}
