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

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertSame(form1, result);
        assertEquals(new EditorFormFieldSet("form1", "form1DisplayName", "form1Description", 1.0, 1.0, false, false, true, Collections.emptySet()), result);
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
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", "displayName", "description", 1.0, 1.0, false, false, true, new HashSet<>(Arrays.asList(
                new EditorFormFieldBuilder("x").removed(true).build(),
                new EditorFormFieldBuilder("y").build()
        )));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", "displayName", "description", 1.0, 1.0, false, false, true, new HashSet<>(Arrays.asList(
                new EditorFormFieldBuilder("y").removed(true).build(),
                new EditorFormFieldBuilder("z").build()
        )));

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("z").build()
        ));
    }

    @Test
    public void mergeWithDoesNotAddRemovedFields() {
        final EditorFormFieldSet form1 = new EditorFormFieldSet("form", "displayName", "description", 1.0, 1.0, false, false, true, Collections.singleton(
            new EditorFormFieldBuilder("x").build()
        ));
        final EditorFormFieldSet form2 = new EditorFormFieldSet("form", "displayName", "description", 1.0, 1.0, false, false, true, Collections.singleton(
            new EditorFormFieldBuilder("y").removed(true).build()
        ));

        EditorFormFieldSet result = form1.mergeWith(form2);

        assertThat(result.getEditorFormFields(), containsInAnyOrder(
                new EditorFormFieldBuilder("x").build()
        ));
    }

}
