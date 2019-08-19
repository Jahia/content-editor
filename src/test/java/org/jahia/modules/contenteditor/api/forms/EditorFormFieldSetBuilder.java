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
    private Boolean activated = true;

    private List<EditorFormField> fields;

    EditorFormFieldSetBuilder(String name) {
        this.name = name;
    }

    EditorFormFieldSetBuilder withPriority(Double priority) {
        this.priority = priority;
        return this;
    }

    EditorFormFieldSetBuilder withFields(EditorFormField... fields) {
        this.fields = (fields.length == 0) ? null : Arrays.asList(fields);
        return this;
    }

    EditorFormFieldSet build() {
        EditorFormFieldSet form = new EditorFormFieldSet();
        form.setName(name);
        form.setDisplayName(displayName);
        form.setDescription(description);
        form.setRank(rank);
        form.setPriority(priority);
        form.setDynamic(dynamic);
        form.setActivated(activated);
        form.setEditorFormFields(fields == null ? null : fields.stream()
                .map(EditorFormField::new)
                .collect(Collectors.toSet())
        );
        return form;
    }

}
