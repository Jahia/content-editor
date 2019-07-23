package org.jahia.modules.contenteditor.api.forms;

import java.util.ArrayList;
import java.util.List;

/**
 * An editor form represents the complete structure that is used to edit a primary node type. It contains an ordered
 * list of sections that contain the sub-structured data
 */
public class EditorForm {

    String name;
    String displayName;
    String description;
    Double priority;

    List<EditorFormSection> sections = new ArrayList<>();

}
