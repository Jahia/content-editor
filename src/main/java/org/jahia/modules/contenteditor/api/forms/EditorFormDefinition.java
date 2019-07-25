package org.jahia.modules.contenteditor.api.forms;

import java.util.List;

/**
 * Represents the definition of an editor form, including the ordering of sections
 */
public class EditorFormDefinition {

    private String name; // the "default" name is reserved to provide a default configuration
    private Double priority;
    private List<String> sections;

}
