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

import graphql.annotations.annotationTypes.GraphQLNonNull;
import org.jahia.modules.contenteditor.graphql.api.types.ContextEntryInput;

import java.util.List;
import java.util.Locale;
import java.util.SortedSet;

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
     * Publish the edited node, it will publish the node only with the associated technical nodes
     * (vanity, visibilities, acls, etc ...)
     * @param locale The locale of the form when editing the node
     * @param uuidOrPath UUID or path of the node path of the node to be edited.
     * @return True in case publication have been scheduled successfully
     * @throws EditorFormException in case of any errors happening during this process
     */
    boolean publishForm(Locale locale, String uuidOrPath) throws EditorFormException;

    /**
     * Retrieve field constraints for given node
     * @param nodeUuidOrPath UUID or path of the node (optional in case you are creating it, and it doesnt exist yet)
     * @param parentNodeUuidOrPath UUID or path of the parent node
     * @param primaryNodeType A string representation of the primary node type of the node
     * @param fieldNodeType A string representation of the field node type (the node type that contains the field, can be the node type of the node, a mixin or a super type)
     * @param fieldName A string representation of field name
     * @param context Object contains additional information of the node
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @return field constraints
     * @throws EditorFormException if there was an error when processing the node data
     */
    List<EditorFormFieldValueConstraint> getFieldConstraints(String nodeUuidOrPath,
                                                             String parentNodeUuidOrPath,
                                                             String primaryNodeType,
                                                             String fieldNodeType,
                                                             String fieldName,
                                                             List<ContextEntryInput> context,
                                                             Locale uiLocale,
                                                             Locale locale) throws EditorFormException;

    SortedSet<EditorFormDefinition> getFormOverrides(@GraphQLNonNull String nodeType);
}
