import {Boolean} from './Boolean';
import styles from './Boolean.scss';

export const registerBoolean = ceRegistry => {
    ceRegistry.add('selectorType', 'Checkbox', {
        dataType: ['Boolean'],
        cmp: Boolean,
        containerStyle: styles.container,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.checkbox.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.checkbox.description'},
            {name: 'iconStart', value: 'Boolean'}
        ],
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        }
    });
};
