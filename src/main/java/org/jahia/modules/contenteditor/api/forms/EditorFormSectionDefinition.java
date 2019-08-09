package org.jahia.modules.contenteditor.api.forms;

/**
 * For the moment this object only contains a name but it is planned for the schema to evolve so we decided to use an
 * object instead of just a string.
 */
public class EditorFormSectionDefinition {
    private String name;
    private String labelKey;
    private String descriptionKey;
    private String requiredPermission;

    public EditorFormSectionDefinition() {
    }

    public EditorFormSectionDefinition(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabelKey() {
        return labelKey;
    }

    public void setLabelKey(String labelKey) {
        this.labelKey = labelKey;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }

    public void setDescriptionKey(String descriptionKey) {
        this.descriptionKey = descriptionKey;
    }

    public String getRequiredPermission() {
        return requiredPermission;
    }

    public void setRequiredPermission(String requiredPermission) {
        this.requiredPermission = requiredPermission;
    }
}
