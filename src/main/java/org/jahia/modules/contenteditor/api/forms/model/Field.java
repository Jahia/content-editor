package org.jahia.modules.contenteditor.api.forms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.jahia.modules.contenteditor.api.forms.Ranked;
import org.jahia.services.content.JCRContentUtils;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedItemDefinition;
import org.jahia.services.content.nodetypes.ExtendedNodeType;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.NodeTypeRegistry;
import org.owasp.html.Sanitizers;

import javax.jcr.nodetype.NoSuchNodeTypeException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static org.jahia.modules.contenteditor.api.forms.EditorFormServiceImpl.resolveResourceKey;

public class Field implements Ranked {
    private String name;
    private String label;
    private String labelKey;
    private String description;
    private String descriptionKey;
    private String errorMessage;
    private String errorMessageKey;
    private Boolean hide;
    private Double rank;
    private String declaringNodeType;
    private ExtendedPropertyDefinition extendedPropertyDefinition;
    private String requiredType;
    private Map<String, Object> selectorOptionsMap;
    private String selectorType;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<FieldValueConstraint> valueConstraints;
    private List<FieldValue> defaultValues;

    private boolean visible = true;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getLabelKey() {
        return labelKey;
    }

    public void setLabelKey(String labelKey) {
        this.labelKey = labelKey;
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

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorMessageKey() {
        return errorMessageKey;
    }

    public void setErrorMessageKey(String errorMessageKey) {
        this.errorMessageKey = errorMessageKey;
    }

    public Boolean isHide() {
        return hide;
    }

    public void setHide(Boolean hide) {
        this.hide = hide;
    }

    public Double getRank() {
        return rank;
    }

    public void setRank(Double rank) {
        this.rank = rank;
    }

    public String getDeclaringNodeType() {
        return declaringNodeType;
    }

    public void setDeclaringNodeType(String declaringNodeType) {
        this.declaringNodeType = declaringNodeType;
    }

    @JsonIgnore
    public ExtendedPropertyDefinition getExtendedPropertyDefinition() {
        return extendedPropertyDefinition;
    }

    public void setExtendedPropertyDefinition(ExtendedPropertyDefinition extendedPropertyDefinition) {
        this.extendedPropertyDefinition = extendedPropertyDefinition;
        if (extendedPropertyDefinition != null) {
            if (this.declaringNodeType != null && !declaringNodeType.equals(extendedPropertyDefinition.getDeclaringNodeType().getName())) {
                System.out.println(name);
            }
            this.declaringNodeType = extendedPropertyDefinition.getDeclaringNodeType().getName();
        }
    }

    public String getRequiredType() {
        return requiredType;
    }

    public void setRequiredType(String requiredType) {
        this.requiredType = requiredType;
    }

    public Map<String, Object> getSelectorOptionsMap() {
        return selectorOptionsMap;
    }

    public void setSelectorOptionsMap(Map<String, Object> selectorOptionsMap) {
        this.selectorOptionsMap = selectorOptionsMap;
    }

    public void setSelectorOptions(List<Property> properties) {
        System.out.println(properties);
    }

    public String getSelectorType() {
        return selectorType;
    }

    public void setSelectorType(String selectorType) {
        this.selectorType = selectorType;
    }

    public Boolean isI18n() {
        return i18n;
    }

    public void setI18n(Boolean i18n) {
        this.i18n = i18n;
    }

    public Boolean isReadOnly() {
        return readOnly;
    }

    public void setReadOnly(Boolean readOnly) {
        this.readOnly = readOnly;
    }

    public Boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(Boolean multiple) {
        this.multiple = multiple;
    }

    public Boolean isMandatory() {
        return mandatory;
    }

    public void setMandatory(Boolean mandatory) {
        this.mandatory = mandatory;
    }

    public List<FieldValueConstraint> getValueConstraints() {
        return valueConstraints;
    }

    public void setValueConstraints(List<FieldValueConstraint> valueConstraints) {
        this.valueConstraints = valueConstraints;
    }

    public List<FieldValue> getDefaultValues() {
        return defaultValues;
    }

    public void setDefaultValues(List<FieldValue> defaultValues) {
        this.defaultValues = defaultValues;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public String getKey() {
        return (declaringNodeType != null ? (declaringNodeType + "_") : "") + name;
    }

    public void initializeLabel(Locale uiLocale, JCRSiteNode site, ExtendedNodeType primaryNodeType) {
        label = label == null && labelKey != null ? resolveResourceKey(labelKey, uiLocale, site) : label;
        description = description == null && descriptionKey != null ? resolveResourceKey(descriptionKey, uiLocale, site) : description;
        errorMessage = errorMessage == null && errorMessageKey != null ? resolveResourceKey(errorMessageKey, uiLocale, site) : errorMessage;

        if (extendedPropertyDefinition != null) {
            // Allow labels from primary node type
            initializeLabelFromItemDefinition(extendedPropertyDefinition, uiLocale, site, primaryNodeType);
            // Looks for labels in override property
            initializeLabelFromItemDefinition(extendedPropertyDefinition, uiLocale, site, extendedPropertyDefinition.getDeclaringNodeType());
            // Then in original overridden property
            ExtendedItemDefinition overridenDefinition = extendedPropertyDefinition.getOverridenDefinition();
            initializeLabelFromItemDefinition(overridenDefinition, uiLocale, site, overridenDefinition.getDeclaringNodeType());
            // Fallback on untranslated system name
            label = StringUtils.isEmpty(label) ? JCRContentUtils.replaceColon(extendedPropertyDefinition.getName()) : label;
        }
    }

    private void initializeLabelFromItemDefinition(ExtendedItemDefinition definition, Locale uiLocale, JCRSiteNode site, ExtendedNodeType nodeType) {
        String suffix = nodeType.getTemplatePackage() != null ? "@" + nodeType.getTemplatePackage().getResourceBundleName() : "";
        String key = definition.getResourceBundleKey(nodeType);
        label = StringUtils.isEmpty(label) ? StringEscapeUtils.unescapeHtml(resolveResourceKey(key + suffix, uiLocale, site)) : label;
        description = StringUtils.isEmpty(description) ? Sanitizers.FORMATTING.sanitize(resolveResourceKey(key + ".ui.tooltip" + suffix, uiLocale, site)) : description;
        errorMessage = StringUtils.isEmpty(errorMessage)? Sanitizers.FORMATTING.sanitize(resolveResourceKey(key + ".constraint.error.message" + suffix, uiLocale, site)) : errorMessage;
    }

    public void mergeWith(Field otherField) {
        setName(name == null ? otherField.getName() : name);

        setLabel(otherField.getLabelKey() != null || otherField.getLabel() != null ? otherField.getLabel() : label);
        setLabelKey(otherField.getLabelKey() != null || otherField.getLabel() != null ? otherField.getLabelKey() : labelKey);
        setDescription(otherField.getDescriptionKey() != null || otherField.getDescription() != null ? otherField.getDescription() : description);
        setDescriptionKey(otherField.getDescriptionKey() != null || otherField.getDescription() != null ? otherField.getDescriptionKey() : descriptionKey);
        setHide(otherField.isHide() != null ? otherField.isHide() : hide);
        setRank(otherField.getRank() != null ? otherField.getRank() : rank);
        setErrorMessage(otherField.getErrorMessage() != null ? otherField.getErrorMessage() : errorMessage);
        setExtendedPropertyDefinition(otherField.getExtendedPropertyDefinition() != null ? otherField.getExtendedPropertyDefinition() : extendedPropertyDefinition);
        setRequiredType(otherField.getRequiredType() != null ? otherField.getRequiredType() : requiredType);
        setSelectorOptionsMap(otherField.getSelectorOptionsMap() != null ? otherField.getSelectorOptionsMap() : selectorOptionsMap);
        setSelectorType(otherField.getSelectorType() != null ? otherField.getSelectorType() : selectorType);
        setI18n(otherField.isI18n() != null ? otherField.isI18n() : i18n);
        setReadOnly(otherField.isReadOnly() != null ? otherField.isReadOnly() : readOnly);
        setMultiple(otherField.isMultiple() != null ? otherField.isMultiple() : multiple);
        setMandatory(otherField.isMandatory() != null ? otherField.isMandatory() : mandatory);
        setMultiple(otherField.isMultiple() != null ? otherField.isMultiple() : multiple);
        setValueConstraints(otherField.getValueConstraints() != null ? otherField.getValueConstraints() : valueConstraints);
        setDefaultValues(otherField.getDefaultValues() != null ? otherField.getDefaultValues() : defaultValues);
    }
}
