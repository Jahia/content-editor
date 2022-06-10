import {Checkbox} from './Checkbox';

export const registerCheckbox = ceRegistry => {
    ceRegistry.add('selectorType', 'Checkbox', {
        cmp: Checkbox,
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        },
        supportMultiple: false
    });
};
