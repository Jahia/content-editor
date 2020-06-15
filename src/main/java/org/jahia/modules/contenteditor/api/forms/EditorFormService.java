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

import java.util.List;
import java.util.Locale;

/**
 * Main service to retrieve form for editing content
 */
public interface EditorFormService {

    /**
     * Retrieves a form editor structure for a given primary node type, by combining automatically generated structures from
     * existing node type definitions and also merging with overrides defined in other modules.
     * @param primaryNodeTypeName the name of the primary node type for which we want to generate the form structure
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @param uuidOrPath uuid or path of the parent node path under with the new node will be created.
     * @return the generated form structure with all the proper default values (as well as choicelists) as well as meta-
     * data such as readonly, etc...
     * @throws EditorFormException if there was an error during the generation of the form.
     */
    EditorForm getCreateForm(String primaryNodeTypeName, Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException;

    /**
     * Retrieves a form editor structure for a given node, by combining automatically generated structures from
     * existing node type definitions and also merging with overrides defined in other modules.
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @param uuidOrPath UUID or path of the node path of the node to be edited.
     * @return the generated form structure with all the proper default values (as well as choicelists) as well as meta-
     * data such as readonly, etc...
     * @throws EditorFormException if there was an error during the generation of the form.
     */
    EditorForm getEditForm(Locale uiLocale, Locale locale, String uuidOrPath) throws EditorFormException;

    /**
     * Retrieve field constraints for given node
     * @param uuidOrPath UUID or path of the node path of the node to be edited.
     * @param fieldName The field name
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @return field constraints
     * @throws EditorFormException if there was an error when processing the node data
     */
    List<EditorFormFieldValueConstraint> getFieldConstraints(String uuidOrPath, String fieldName, Locale uiLocale, Locale locale) throws EditorFormException;
}
