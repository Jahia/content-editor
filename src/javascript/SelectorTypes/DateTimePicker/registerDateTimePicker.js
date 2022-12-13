import {DateTimePicker} from './DateTimePicker';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerDateTimePicker = ceRegistry => {
    ceRegistry.add('selectorType', 'DateTimePicker', {
        dataType: ['Date'],
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
    ceRegistry.add('selectorType', 'DatePicker', {
        dataType: ['Date'],
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
};
