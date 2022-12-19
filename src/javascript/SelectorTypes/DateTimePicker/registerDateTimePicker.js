import {DateTimePicker} from './DateTimePicker';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerDateTimePicker = ceRegistry => {
    ceRegistry.add('selectorType', 'DateTimePicker', {
        dataType: ['Date'],
        cmp: DateTimePicker,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.dateTimePicker.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.dateTimePicker.description'},
            {name: 'iconStart', value: 'Clock'}
        ],
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
    ceRegistry.add('selectorType', 'DatePicker', {
        dataType: ['Date'],
        cmp: DateTimePicker,
        labelKey: 'content-editor:label.contentEditor.selectorTypes.datePicker.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.datePicker.description'},
            {name: 'iconStart', value: 'Calendar'}
        ],
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
};
