package org.jahia.modules.contenteditor.api.forms;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a logical section of field sets.
 */
public class EditorFormSection {

    List<EditorFormFieldSet> fieldSets = new ArrayList<>();
    private String name;
    private Double rank;
    private Double priority;
    private String displayName;
    private String description;

}
