package org.jahia.modules.contenteditor.api.forms;

/**
 * Main service to retrieve form for editing content
 */
public interface EditorFormService {

    /**
     * Retrieves a form editor structure for a given node type, by combining automatically generated structures from
     * existing node type definitions and also merging with overrides defined in other modules.
     * @param nodeTypeName the name of the node type for which we want to generate the form structure
     * @param locale a String representation of a Locale (such as "en", "en_US", etc...)
     * @param existingNodeIdentifier the node identifier of an existing node. This is optional, if specified it will be
     *                               used to check constraints such as locks.
     * @return the generated form structure with all the proper default values (as well as choicelists) as well as meta-
     * data such as readonly, etc...
     */
    EditorForm getEditorFormByNodeType(String nodeTypeName, String locale, String existingNodeIdentifier);
}
