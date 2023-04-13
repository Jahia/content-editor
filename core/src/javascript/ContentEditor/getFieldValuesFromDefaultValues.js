import {resolveSelectorType} from '~/SelectorTypes/resolveSelectorType';

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
