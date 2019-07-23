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

final class EditorFormBuilder {

    private String nodeType;
    private Double priority;
    private List<EditorFormField> fields;

    EditorFormBuilder(String nodeType) {
        this.nodeType = nodeType;
    }

    EditorFormBuilder withPriority(Double priority) {
        this.priority = priority;
        return this;
    }

    EditorFormBuilder withFields(EditorFormField ...fields) {
        this.fields = (fields.length == 0) ? null : Arrays.asList(fields);
        return this;
    }

    EditorFormFieldSet build() {
        EditorFormFieldSet form = new EditorFormFieldSet();
        form.setName(nodeType);
        form.setPriority(priority);
        form.setEditorFormFields(fields == null ? null : fields.stream()
                .map(field -> new EditorFormField(field))
                .collect(Collectors.toList())
        );
        return form;
    }

}
