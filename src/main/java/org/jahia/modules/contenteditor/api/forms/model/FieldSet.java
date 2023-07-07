package org.jahia.modules.contenteditor.api.forms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.modules.contenteditor.api.forms.DefinitionRegistryItem;
import org.jahia.modules.contenteditor.api.forms.Ranked;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.osgi.framework.Bundle;
import org.owasp.html.Sanitizers;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import static org.jahia.modules.contenteditor.api.forms.EditorFormServiceImpl.resolveResourceKey;

public class FieldSet implements DefinitionRegistryItem, Ranked {
    private String name;
    private ExtendedNodeType nodeType;
    private String labelKey;
    private String descriptionKey;
    private String label;
    private String description;
    private String requiredPermission;
    private Boolean hide;
    private Boolean readOnly;
    private Double rank;
    private List<Field> fields = new ArrayList<>();
    private Double priority;
    private Bundle originBundle;

    private boolean dynamic = false;
    private boolean hasEnableSwitch = false;
    private boolean activated = true;
    private boolean visible = true;

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

    @Deprecated
    public void setDisplayName(String displayName) {
        this.label = displayName;
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

    public String getRequiredPermission() {
        return requiredPermission;
    }

    public void setRequiredPermission(String requiredPermission) {
        this.requiredPermission = requiredPermission;
    }

    public Boolean isHide() {
        return hide;
    }

    public void setHide(Boolean hide) {
        this.hide = hide;
    }

    @Deprecated
    public void setRemoved(Boolean removed) {
        this.hide = removed;
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

    @Override
    public Double getPriority() {
        return priority;
    }

    public void setPriority(Double priority) {
        this.priority = priority;
    }

    @JsonIgnore
    public Bundle getOriginBundle() {
        return originBundle;
    }

    public void setOriginBundle(Bundle originBundle) {
        this.originBundle = originBundle;
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

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    @JsonIgnore
    public ExtendedNodeType getNodeType() {
        return nodeType;
    }

    public void initializeLabel(Locale uiLocale, JCRSiteNode site) {
        label = label == null && labelKey != null ? resolveResourceKey(labelKey, uiLocale, site) : label;
        description = description == null && descriptionKey != null ? resolveResourceKey(descriptionKey, uiLocale, site) : description;

        if (nodeType != null) {
            String suffix = nodeType.getTemplatePackage() != null ? "@" + nodeType.getTemplatePackage().getResourceBundleName() : "";
            String key =  JCRContentUtils.replaceColon(nodeType.getName());
            label = StringUtils.isEmpty(label) ? StringEscapeUtils.unescapeHtml(resolveResourceKey(key + suffix, uiLocale, site)) : label;
            description = StringUtils.isEmpty(description) ? Sanitizers.FORMATTING.sanitize(resolveResourceKey(key + ".ui.tooltip" + suffix, uiLocale, site)) : description;

            label = StringUtils.isEmpty(label) ? StringUtils.substringAfter(nodeType.getName(), ":") : label;
        }
    }


    private Field addField() {
        Field f = new Field();
        fields.add(f);
        f.setRank((double) fields.size());
        return f;
    }

    public void mergeWith(FieldSet otherFieldSet, Form form) {
        setName(name == null ? (otherFieldSet.getName().equals("<main>") ? form.getNodeType().getName() : otherFieldSet.getName()) : name);

        setLabel(otherFieldSet.getLabelKey() != null || otherFieldSet.getLabel() != null ? otherFieldSet.getLabel() : label);
        setLabelKey(otherFieldSet.getLabelKey() != null || otherFieldSet.getLabel() != null ? otherFieldSet.getLabelKey() : labelKey);
        setDescription(otherFieldSet.getDescriptionKey() != null || otherFieldSet.getDescription() != null ? otherFieldSet.getDescription() : description);
        setDescriptionKey(otherFieldSet.getDescriptionKey() != null || otherFieldSet.getDescription() != null ? otherFieldSet.getDescriptionKey() : descriptionKey);
        setRequiredPermission(otherFieldSet.getRequiredPermission() != null ? otherFieldSet.getRequiredPermission() : requiredPermission);
        setHide(otherFieldSet.isHide() != null ? otherFieldSet.isHide() : hide);
        setRank(otherFieldSet.getRank() != null ? otherFieldSet.getRank() : rank);

        mergeFields(otherFieldSet.getFields(), form);
    }

    private void mergeFields(List<Field> otherFields, Form form) {
        for (Field otherField : otherFields) {
            Field existingField = form.findAndRemoveField(otherField).orElseGet(this::addField);
            existingField.mergeWith(otherField);
            if (!fields.contains(existingField)) {
                fields.add(existingField);
            }
        }
    }

}
