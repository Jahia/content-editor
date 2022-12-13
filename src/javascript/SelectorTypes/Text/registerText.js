import {Text} from './Text';

export const registerText = ceRegistry => {
    ceRegistry.add('selectorType', 'Text', {
        dataType: ['String', 'Double', 'Long'],
        cmp: Text,
        supportMultiple: false,
        adaptValue: (field, property) => {
            if (field.selectorOptions?.find(option => option.name === 'password')) {
                return field.multiple ? property.decryptedValues : property.decryptedValue;
            }

            return field.multiple ? property.values : property.value;
        }
    });
};
