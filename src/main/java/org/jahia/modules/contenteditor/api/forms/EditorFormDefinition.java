package org.jahia.modules.contenteditor.api.forms;

import org.osgi.framework.Bundle;

import java.util.List;

/**
 * Represents the definition of an editor form, including the ordering of sections
 */
public class EditorFormDefinition implements Comparable<EditorFormDefinition> {

    private String name; // the "default" name is reserved to provide a default configuration
    private Double priority;
    private List<EditorFormSectionDefinition> sections;
    private Bundle originBundle;

    public EditorFormDefinition() {
    }

    public EditorFormDefinition(String name, Double priority, List<EditorFormSectionDefinition> sections, Bundle originBundle) {
        this.name = name;
        this.priority = priority;
        this.sections = sections;
        this.originBundle = originBundle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    public List<EditorFormSectionDefinition> getSections() {
        return sections;
    }

    public void setSections(List<EditorFormSectionDefinition> sections) {
        this.sections = sections;
    }

    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
    }

    @Override
    public int compareTo(EditorFormDefinition otherEditorFormDefinition) {
        if (otherEditorFormDefinition == null) {
            return -1;
        }
        int compareName = name.compareTo(otherEditorFormDefinition.name);
        if (compareName != 0) {
            return compareName;
        }
        if (priority == null) {
            if (otherEditorFormDefinition.priority != null) return -1;
            else return 0;
        } else {
            if (otherEditorFormDefinition.priority == null) return 1;
            return priority.compareTo(otherEditorFormDefinition.priority);
        }
    }

    public EditorFormDefinition mergeWith(EditorFormDefinition otherEditorFormDefinition) {
        if (!name.equals(otherEditorFormDefinition.name)) {
            // names are not equal, we won't merge anything.
            return this;
        }
        return new EditorFormDefinition(name, priority, otherEditorFormDefinition.sections != null ? otherEditorFormDefinition.sections : sections, null);
    }

}
