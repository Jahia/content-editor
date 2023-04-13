import {Text} from './Text';

export const registerText = ceRegistry => {
    ceRegistry.add('selectorType', 'Text', {
        dataType: ['String', 'Double', 'Long'],
        cmp: Text,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.text.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.text.description'},
            {name: 'iconStart', value: 'Text'}
        ],
        supportMultiple: false,
        adaptValue: (field, property) => {
            if (field.selectorOptions?.find(option => option.name === 'password')) {
                return field.multiple ? property.decryptedValues : property.decryptedValue;
            }

            return field.multiple ? property.values : property.value;
        }
    });
};
