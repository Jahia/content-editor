import Tag from './Tag';
import Text from './Text';
import TextArea from './TextArea';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import choiceListActions from './ChoiceList/ChoiceList.actions';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';

let SelectorTypes = {};

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

// Workaround for unit tests to avoid: "Couldn't call getPickerSelectorTypes() of undefined."
if (pickerConfigs) {
    SelectorTypes = {
        Tag: {cmp: Tag, key: 'Tag', supportMultiple: true},
        Text: {cmp: Text, key: 'Text', supportMultiple: false},
        TextArea: {cmp: TextArea, key: 'TextArea', supportMultiple: false},
        RichText: {cmp: RichText, key: 'RichText', supportMultiple: false},
        Choicelist: {cmp: ChoiceList, key: 'Choicelist', actions: choiceListActions, supportMultiple: true},
        DateTimePicker: {
            cmp: DateTimePicker,
            key: 'DateTimePicker',
            supportMultiple: false,
            adaptPropertyValue: adaptDateProperty
        },
        DatePicker: {
            cmp: DateTimePicker,
            key: 'DatePicker',
            supportMultiple: false,
            adaptPropertyValue: adaptDateProperty},
        Checkbox: {
            cmp: Checkbox,
            key: 'Checkbox',
            adaptPropertyValue: (field, property) => {
                return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
            },
            supportMultiple: false
        },
        ...pickerConfigs.getPickerSelectorTypes()
    };
}

export {SelectorTypes};

export const SelectorTypeResolvers = {
    Picker: options => pickerConfigs.getPickerSelectorType(options)
};
