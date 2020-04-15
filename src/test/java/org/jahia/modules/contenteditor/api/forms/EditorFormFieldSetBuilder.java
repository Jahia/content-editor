/*
 * ==========================================================================================
 * =                   JAHIA'S DUAL LICENSING - IMPORTANT INFORMATION                       =
 * ==========================================================================================
 *
 *                                 http://www.jahia.com
 *
 *     Copyright (C) 2002-2020 Jahia Solutions Group SA. All rights reserved.
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
