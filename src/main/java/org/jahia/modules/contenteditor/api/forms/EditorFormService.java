package org.jahia.modules.contenteditor.api.forms;

import java.util.Locale;

/**
 * Main service to retrieve form for editing content
 */
public interface EditorFormService {

    /**
     * Retrieves a form editor structure for a given node type, by combining automatically generated structures from
     * existing node type definitions and also merging with overrides defined in other modules.
     * @param nodeTypeName the name of the node type for which we want to generate the form structure
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @param contextPath the parent node path under with the new node will be created.
     * @return the generated form structure with all the proper default values (as well as choicelists) as well as meta-
     * data such as readonly, etc...
     * @throws EditorFormException if there was an error during the generation of the form.
     */
    EditorForm getCreateForm(String nodeTypeName, Locale uiLocale, Locale locale, String contextPath) throws EditorFormException;

    /**
     * Retrieves a form editor structure for a given node, by combining automatically generated structures from
     * existing node type definitions and also merging with overrides defined in other modules.
     * @param uiLocale The locale used to display the labels
     * @param locale The locale used to get nodes data
     * @param contextPath the node path of the node to be edited.
     * @return the generated form structure with all the proper default values (as well as choicelists) as well as meta-
     * data such as readonly, etc...
     * @throws EditorFormException if there was an error during the generation of the form.
     */
    EditorForm getEditorForm(Locale uiLocale, Locale locale, String contextPath) throws EditorFormException;
}
