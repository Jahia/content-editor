package org.jahia.modules.contenteditor.api.forms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
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

public class Field implements Cloneable, Comparable<Field> {
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
    private Map<String, Object> selectorOptions;
    private String selectorType;
    private Boolean i18n;
    private Boolean readOnly;
    private Boolean multiple;
    private Boolean mandatory;
    private List<FieldValueConstraint> valueConstraints;
    private List<FieldValue> currentValues;
    private List<FieldValue> defaultValues;

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

    public Map<String, Object> getSelectorOptions() {
        return selectorOptions;
    }

    public void setSelectorOptions(Map<String, Object> selectorOptions) {
        this.selectorOptions = selectorOptions;
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

    public String getKey() {
        return (declaringNodeType != null ? (declaringNodeType + "_") : "") + name;
    }

    public void initializeLabel(Locale uiLocale, JCRSiteNode site) {
        label = label == null && labelKey != null ? resolveResourceKey(labelKey, uiLocale, site) : label;
        description = description == null && descriptionKey != null ? resolveResourceKey(descriptionKey, uiLocale, site) : description;
        errorMessage = errorMessage == null && errorMessageKey != null ? resolveResourceKey(errorMessageKey, uiLocale, site) : errorMessage;

        if (extendedPropertyDefinition != null) {
            // Use item definition to resolve labels. (same way as ContentDefinitionHelper.getGWTJahiaNodeType()) ???
            try {
                ExtendedNodeType extendedNodeType = NodeTypeRegistry.getInstance().getNodeType(extendedPropertyDefinition.getDeclaringNodeType().getAlias());
                ExtendedItemDefinition item = extendedNodeType.getItems().stream().filter(item1 -> StringUtils.equals(item1.getName(), extendedPropertyDefinition.getName())).findAny().orElse(extendedPropertyDefinition);

                label = label == null ? StringEscapeUtils.unescapeHtml(item.getLabel(uiLocale, extendedNodeType)) : label;
                description = description == null ? Sanitizers.FORMATTING.sanitize(item.getTooltip(uiLocale, extendedNodeType)) : description;
            } catch (NoSuchNodeTypeException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public int compareTo(Field other) {
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

    public Field clone() {
        try {
            Field newField = (Field) super.clone();
            return newField;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
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
        setSelectorOptions(otherField.getSelectorOptions() != null ? otherField.getSelectorOptions() : selectorOptions);
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
