import {resolveSelectorType} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

export const adaptSystemNameField = (rawData, formData, lang, t, customAdapter) => {
    // Add i18ns to field and fieldset
    const optionsSection = formData.sections.find(section => section.name === 'options');
    if (optionsSection) {
        const ntBaseFieldSet = optionsSection.fieldSets.find(fieldSet => fieldSet.name === 'nt:base');
        if (ntBaseFieldSet) {
            ntBaseFieldSet.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.displayName');
            const systemNameField = ntBaseFieldSet.fields.find(field => field.name === 'ce:systemName');
            if (systemNameField) {
                systemNameField.displayName = t('content-editor:label.contentEditor.section.fieldSet.system.fields.systemName');
            }
        }
    }

    if (customAdapter) {
        customAdapter(rawData, formData, lang, t);
    }
};

export const adaptSections = sections => {
    const cloneSections = JSON.parse(JSON.stringify(sections));

    return cloneSections
        .reduce((result, section) => {
            if (section.name === 'metadata') {
                section.fieldSets = section.fieldSets.reduce((fieldSetsField, fieldSet) => {
                    if (fieldSet.fields.find(f => f.readOnly)) {
                        return [...fieldSetsField];
                    }

                    return [...fieldSetsField, fieldSet];
                }, []);
            }

            return [...result, section];
        }, [])
        .filter(section => (section.fieldSets && section.fieldSets.length > 0));
};

export const getFieldValuesFromDefaultValues = field => {
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (field.defaultValues && field.defaultValues.length > 0) {
        const mappedValues = field.defaultValues.map(defaultValue => {
            return defaultValue.string;
        });

        if (selectorType.adaptValue) {
            formFields[field.name] = selectorType.adaptValue(field, {
                value: mappedValues[0],
                notZonedDateValue: mappedValues[0],
                values: mappedValues,
                notZonedDateValues: mappedValues
            });
        } else {
            formFields[field.name] = field.multiple ? mappedValues : mappedValues[0];
        }
    } else if (selectorType && selectorType.initValue) {
        formFields[field.name] = selectorType.initValue(field);
    }

    return formFields;
};
