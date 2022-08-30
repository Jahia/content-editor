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

import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

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

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

        assertSame(form1, result);
        assertEquals(new EditorFormFieldSet("form1", "form1DisplayName", "form1Description", false, false, true, true, false,Collections.emptySet()), result);
    }

    @Test
    public void mergeWithCanOverrideAnyUnsetProperty() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form").build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form")
                .withPriority(1d)
                .withFields(new EditorFormFieldBuilder("x").build())
                .build();

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

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

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

        assertNotSame(form1, result);
        assertNotSame(form2, result);
        assertEquals(Double.valueOf(1d), result.getPriority());
        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
    }

    @Test
    public void mergeWithCanOverridePriority() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("form").withPriority(1d).build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("form").withPriority(2d).build();

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

        assertEquals(Double.valueOf(2d), result.getPriority());
    }

    @Test
    public void mergeWithDoesNotRetainRemovedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, new HashSet<>(Arrays.asList(
                new EditorFormFieldBuilder("x").removed(true).build(),
                new EditorFormFieldBuilder("y").build()
        )));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, new HashSet<>(Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build(),
                new EditorFormFieldBuilder("z").build()
        )));

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("z").build()
        ));
    }

    @Test
    public void mergeWithDoesNotAddRemovedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, Collections.singleton(
            new EditorFormFieldBuilder("x").build()
        ));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, Collections.singleton(
            new EditorFormFieldBuilder("y").removed(true).build()
        ));

        EditorFormFieldSet result = form1.mergeWith(form2, new HashSet<>());

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
            new EditorFormFieldBuilder("x").build()
        ));
    }

    @Test
    public void mergeRemoveFieldSet() {
        final EditorFormFieldSet form1 = new EditorFormFieldSetBuilder("jmix:description").withRemoved(true).build();
        final EditorFormFieldSet form2 = new EditorFormFieldSetBuilder("jmix:description").withRemoved(false).build();

        assertTrue("Removed should be false", !form1.mergeWith(form2, new HashSet<>()).getRemoved());
        assertTrue("Removed should be true", form2.mergeWith(form1, new HashSet<>()).getRemoved());

    }


    @Test
    public void mergeWithDoesNotAddAlreadyProcessedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, Collections.singleton(
            new EditorFormFieldBuilder("x").build()
        ));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", "displayName", "description", false, false, true, true, false, Collections.singleton(
            new EditorFormFieldBuilder("y").build()
        ));

        // y property in that case would have been added by a previous fieldset, so form2 cannot provide his y property as a new prop
        EditorFormFieldSet result = form1.mergeWith(form2, Collections.singleton("y"));

        assertThat(result.getEditorFormFields(), contains(new EditorFormFieldBuilder("x").build()));
        assertEquals(result.getEditorFormFields().size(), 1);
    }
}
