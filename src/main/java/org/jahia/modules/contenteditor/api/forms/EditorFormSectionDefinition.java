package org.jahia.modules.contenteditor.api.forms;

/**
 * For the moment this object only contains a name but it is planned for the schema to evolve so we decided to use an
 * object instead of just a string.
 */
public class EditorFormSectionDefinition {
    private String name;

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

}
