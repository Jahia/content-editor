package org.jahia.modules.contenteditor.api.forms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringEscapeUtils;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.owasp.html.Sanitizers;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static org.jahia.modules.contenteditor.api.forms.EditorFormServiceImpl.resolveResourceKey;

public class FieldSet implements Cloneable, Comparable<FieldSet> {
    private String name;
    private String labelKey;
    private String descriptionKey;
    private String label;
    private String description;
    private Boolean hide;
    private Boolean readOnly;
    private Double rank = 0.0;
    private List<Field> fields = new ArrayList<>();
    private ExtendedNodeType nodeType;

    private boolean dynamic = false;
    private boolean hasEnableSwitch = false;
    private boolean activated = true;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        try {
            this.nodeType = NodeTypeRegistry.getInstance().getNodeType(name);
        } catch (NoSuchNodeTypeException e) {
            // No node type
        }
    }

    public String getLabelKey() {
        return labelKey;
    }

    public void setLabelKey(String labelKey) {
        this.labelKey = labelKey;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }

    public void setDescriptionKey(String descriptionKey) {
        this.descriptionKey = descriptionKey;
    }

    public Boolean isHide() {
        return hide;
    }

    public void setHide(Boolean hide) {
        this.hide = hide;
    }

    public Boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    @JsonIgnore
    public boolean isDynamic() {
        return dynamic;
    }

    public void setDynamic(boolean dynamic) {
        this.dynamic = dynamic;
    }

    @JsonIgnore
    public boolean isHasEnableSwitch() {
        return hasEnableSwitch;
    }

    public void setHasEnableSwitch(boolean hasEnableSwitch) {
        this.hasEnableSwitch = hasEnableSwitch;
    }

    @JsonIgnore
    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    @JsonIgnore
    public ExtendedNodeType getNodeType() {
        return nodeType;
    }

    public void initializeLabel(Locale uiLocale, JCRSiteNode site) {
        label = label == null && labelKey != null ? resolveResourceKey(labelKey, uiLocale, site) : label;
        description = description == null && descriptionKey != null ? resolveResourceKey(descriptionKey, uiLocale, site) : description;

        if (nodeType != null) {
            label = label == null ? StringEscapeUtils.unescapeHtml(nodeType.getLabel(uiLocale)) : label;
            description = description == null ? Sanitizers.FORMATTING.sanitize(nodeType.getDescription(uiLocale)) : description;
        }
    }

    @Override
    public int compareTo(FieldSet other) {
        if (other == null || other.getRank() == null) {
            return -1;
        }

        if (rank == null) {
            return 1;
        }

        if (!rank.equals(other.getRank())) {
            return rank.compareTo(other.getRank());
        }
        return name.compareTo(other.getName());
    }

    public FieldSet clone() {
        try {
            FieldSet newFieldSet = (FieldSet) super.clone();
            if (fields != null) {
                newFieldSet.setFields(fields.stream().map(Field::clone).collect(Collectors.toList()));
            }
            return newFieldSet;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }

    public void mergeWith(FieldSet otherFieldSet, Form form) {
        setName(name == null ? otherFieldSet.getName() : name);

        setLabel(otherFieldSet.getLabelKey() != null || otherFieldSet.getLabel() != null ? otherFieldSet.getLabel() : label);
        setLabelKey(otherFieldSet.getLabelKey() != null || otherFieldSet.getLabel() != null ? otherFieldSet.getLabelKey() : labelKey);
        setDescription(otherFieldSet.getDescriptionKey() != null || otherFieldSet.getDescription() != null ? otherFieldSet.getDescription() : description);
        setDescriptionKey(otherFieldSet.getDescriptionKey() != null || otherFieldSet.getDescription() != null ? otherFieldSet.getDescriptionKey() : descriptionKey);
        setHide(otherFieldSet.isHide() != null ? otherFieldSet.isHide() : hide);
        setRank(otherFieldSet.getRank() != null ? otherFieldSet.getRank() : rank);

        mergeFields(otherFieldSet.getFields(), form);
    }

    private void mergeFields(List<Field> otherFields, Form form) {
        for (Field otherField : otherFields) {
            Field existingField = form.findAndRemoveField(otherField).orElseGet(Field::new);
            existingField.mergeWith(otherField);
            if (!fields.contains(existingField)) {
                fields.add(existingField);
            }
        }
        Collections.sort(fields);
    }

}
