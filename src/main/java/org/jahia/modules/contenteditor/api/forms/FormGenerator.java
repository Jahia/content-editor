package org.jahia.modules.contenteditor.api.forms;

import org.jahia.modules.contenteditor.api.forms.model.*;
import org.jahia.services.content.nodetypes.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class FormGenerator {
    private static final Logger logger = LoggerFactory.getLogger(EditorFormServiceImpl.class);
    private static final Map<Integer, Integer> defaultSelectors = new HashMap<>();

    // we extend the map from SelectorType.defaultSelectors to add more.
    // Regex for range format of a constraint value, extracted from org.apache.jackrabbit.spi.commons.nodetype.constraint.NumericConstraint
    private static final Pattern RANGE_PATTERN = Pattern.compile("([\\(\\[]) *(\\-?\\d+\\.?\\d*)? *, *(\\-?\\d+\\.?\\d*)? *([\\)\\]])");
    private static final int LOWER_LIMIT_RANGE_IDX = 2;

    static {
        defaultSelectors.put(PropertyType.STRING, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.LONG, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.DOUBLE, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.DATE, SelectorType.DATETIMEPICKER);
        defaultSelectors.put(PropertyType.BOOLEAN, SelectorType.CHECKBOX);
        defaultSelectors.put(PropertyType.NAME, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.PATH, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.WEAKREFERENCE, SelectorType.CONTENTPICKER);
        defaultSelectors.put(PropertyType.DECIMAL, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.URI, SelectorType.SMALLTEXT);
        defaultSelectors.put(PropertyType.REFERENCE, SelectorType.CONTENTPICKER);
        defaultSelectors.put(PropertyType.BINARY, SelectorType.SMALLTEXT);
    }

    public static Form generateForm(ExtendedNodeType nodeType, Locale locale, boolean singleFieldSet) throws RepositoryException {
        Form form = new Form();
        form.setNodeType(nodeType.getName());
        form.setPriority(0.);
        form.setHasPreview(false);
        form.setSections(generateFormSections(nodeType, locale, singleFieldSet));
        return form;
    }

    public static List<Section> generateFormSections(ExtendedNodeType nodeType, Locale locale, boolean singleFieldSet) throws RepositoryException {
        Map<String, Section> sections = new HashMap<>();
        Set<String> processedProperties = new HashSet<>();

        List<ExtendedItemDefinition> itemDefinitions = new ArrayList<>(nodeType.getDeclaredItems(true));
        for (ExtendedNodeType supertype : nodeType.getSupertypes()) {
            itemDefinitions.addAll(supertype.getDeclaredItems(true));
        }

        if (singleFieldSet) {
            // Add fieldset even if there's no field
            String itemsType = nodeType.getItemsType();
            if (itemsType == null) {
                itemsType = "content";
            }

            generateFieldSetForSection(sections, itemsType, nodeType.getName());
        }

        for (ExtendedItemDefinition itemDefinition : itemDefinitions) {
            // do not return hidden props
            if (itemDefinition.isNode() || itemDefinition.isHidden() || itemDefinition.isUnstructured() || processedProperties.contains(itemDefinition.getName())) {
                processedProperties.add(itemDefinition.getName());
                continue;
            }

            String itemType = itemDefinition.getItemType();
            Field editorFormField = generateEditorFormField(itemDefinition, locale);
            FieldSet fieldSet = generateFieldSetForSection(sections, itemType, singleFieldSet ? nodeType.getName() : itemDefinition.getOverridenDefinition().getDeclaringNodeType().getName());
            fieldSet.getFields().add(editorFormField);

            processedProperties.add(itemDefinition.getName());
        }

        return new ArrayList<>(sections.values());
    }

    public static FieldSet generateFieldSetForSection(Map<String, Section> sections, String sectionName, String fieldSetName) {
        if (!sections.containsKey(sectionName)) {
            Section section = new Section();
            section.setName(sectionName);
            section.setFieldSets(new ArrayList<>());
            sections.put(sectionName, section);
        }
        List<FieldSet> fieldSets = sections.get(sectionName).getFieldSets();

        Optional<FieldSet> fieldSet = fieldSets.stream().filter(f -> f.getName().equals(fieldSetName)).findFirst();

        return fieldSet.orElseGet(() -> {
            FieldSet fieldset = new FieldSet();
            fieldset.setName(fieldSetName);
            fieldset.setHide(false);
            fieldset.setFields(new ArrayList<>());
            fieldSets.add(fieldset);
            return fieldset;
        });
    }

    public static Field generateEditorFormField(ExtendedItemDefinition itemDefinition, Locale locale) throws RepositoryException {
        ExtendedPropertyDefinition propertyDefinition = (ExtendedPropertyDefinition) itemDefinition;

        ExtendedNodeType declaringNodeType = propertyDefinition.getDeclaringNodeType();
        List<FieldValueConstraint> valueConstraints = new ArrayList<>();
        for (String valueConstraint : propertyDefinition.getValueConstraints()) {
            // Check if the constraint value is a range of numeric value
            // Always take the lower boundary
            if (propertyDefinition.getSelector() == SelectorType.CHOICELIST && (propertyDefinition.getRequiredType() == PropertyType.DOUBLE || propertyDefinition.getRequiredType() == PropertyType.LONG || propertyDefinition.getRequiredType() == PropertyType.DECIMAL)) {
                try {
                    Matcher rangeMatcher = RANGE_PATTERN.matcher(valueConstraint);
                    if (rangeMatcher.matches()) {
                        valueConstraint = rangeMatcher.group(LOWER_LIMIT_RANGE_IDX);
                    }
                    // Cast double to long to match the constraint type
                    if (propertyDefinition.getRequiredType() == PropertyType.LONG) {
                        valueConstraint = Long.toString(Double.valueOf(valueConstraint).longValue());
                    }
                } catch (Exception e) {
                    // it's not, keep value as it is
                }
            }
            FieldValueConstraint cst = new FieldValueConstraint();
            cst.setDisplayValue(valueConstraint);
            cst.setValue(new FieldValue("String", valueConstraint));
            valueConstraints.add(cst);
        }
        Map<String, Object> selectorOptions = null;
        if (propertyDefinition.getSelectorOptions() != null) {
            selectorOptions = new LinkedHashMap<>(propertyDefinition.getSelectorOptions());
        }
        List<FieldValue> defaultValues = null;
        if (propertyDefinition.getDefaultValues() != null) {
            defaultValues = Arrays.stream(propertyDefinition.getDefaultValues(locale)).map(FieldValue::convert).filter(Objects::nonNull).collect(Collectors.toList());
        }

        String errorMessageKey = itemDefinition.getResourceBundleKey() + ".constraint.error.message";
        if (itemDefinition.getDeclaringNodeType().getTemplatePackage() != null) {
            errorMessageKey += "@" + itemDefinition.getDeclaringNodeType().getTemplatePackage().getResourceBundleName();
        }

        String selectorType = SelectorType.nameFromValue(propertyDefinition.getSelector());
        if (selectorType == null) {
            // selector type was not found in the list of selector types in the core, let's try our more expanded one
            if (defaultSelectors.containsKey(propertyDefinition.getRequiredType())) {
                selectorType = SelectorType.nameFromValue(defaultSelectors.get(propertyDefinition.getRequiredType()));
            } else {
                logger.warn("Couldn't resolve a default selector type for property " + propertyDefinition.getName());
            }
        }

        Field field = new Field();
        field.setName(propertyDefinition.getName());
        field.setErrorMessageKey(errorMessageKey);
        field.setExtendedPropertyDefinition(propertyDefinition);
        field.setRequiredType(PropertyType.nameFromValue(propertyDefinition.getRequiredType()));
        field.setSelectorType(selectorType);
        field.setSelectorOptionsMap(selectorOptions);
        field.setI18n(propertyDefinition.isInternationalized());
        field.setReadOnly(propertyDefinition.isProtected());
        field.setMultiple(propertyDefinition.isMultiple());
        field.setMandatory(propertyDefinition.isMandatory());
        field.setValueConstraints(valueConstraints);
        field.setDefaultValues(defaultValues);
        return field;
    }
}
