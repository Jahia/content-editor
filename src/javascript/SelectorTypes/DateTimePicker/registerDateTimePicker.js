import {DateTimePicker} from '~/SelectorTypes/DateTimePicker';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerDateTimePicker = ceRegistry => {
    ceRegistry.add('selectorType', 'DateTimePicker', {
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
    ceRegistry.add('selectorType', 'DatePicker', {
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
};
