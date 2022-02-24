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

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

final class EditorFormFieldSetBuilder {

    private String name;
    private String displayName;
    private String description;
    private Double rank = 1.0;
    private Double priority = 1.0;
    private Boolean dynamic = false;
    private Boolean displayed = true;
    private Boolean activated = true;
    private Boolean readOnly = false;
    private Boolean removed = false;

    private List<EditorFormField> fields;

    EditorFormFieldSetBuilder(String name) {
        this.name = name;
    }

    EditorFormFieldSetBuilder withPriority(Double priority) {
        this.priority = priority;
        return this;
    }

    EditorFormFieldSetBuilder withRemoved(Boolean removed) {
        this.removed = removed;
        return this;
    }

    EditorFormFieldSetBuilder withDescription(String description) {
        this.description = description;
        return this;
    }

    EditorFormFieldSetBuilder withDisplayName(String displayName) {
        this.displayName = displayName;
        return this;
    }

    EditorFormFieldSetBuilder withFields(EditorFormField... fields) {
        this.fields = (fields.length == 0) ? null : Arrays.asList(fields);
        return this;
    }

    EditorFormFieldSet build() {
        EditorFormFieldSet form = new EditorFormFieldSet();
        form.setName(name);
        form.setRemoved(removed);
        form.setDisplayName(displayName);
        form.setDescription(description);
        form.setRank(rank);
        form.setPriority(priority);
        form.setDynamic(dynamic);
        form.setActivated(activated);
        form.setDisplayed(displayed);
        form.setReadOnly(readOnly);
        form.setEditorFormFields(fields == null ? null : fields.stream()
                .map(EditorFormField::new)
                .collect(Collectors.toSet())
        );
        return form;
    }

}
