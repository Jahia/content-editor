import Tag from './Tag';
import Text from './Text';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import choiceListActions from './ChoiceList/ChoiceList.actions';
import TextArea from './TextArea';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';

export const SelectorTypes = {
    Tag: {cmp: Tag, key: 'Tag', supportMultiple: true},
    Text: {cmp: Text, key: 'Text', supportMultiple: false},
    TextArea: {cmp: TextArea, key: 'TextArea', supportMultiple: false},
    RichText: {cmp: RichText, key: 'RichText', supportMultiple: false},
    Choicelist: {cmp: ChoiceList, key: 'Choicelist', actions: choiceListActions, supportMultiple: true},
    DateTimePicker: {cmp: DateTimePicker, key: 'DateTimePicker', supportMultiple: false},
    DatePicker: {cmp: DateTimePicker, key: 'DatePicker', supportMultiple: false},
    Checkbox: {
        cmp: Checkbox,
        key: 'Checkbox',
        formatValue: value => {
            return value === 'true'; // Value from JCR GraphQL API is a String
        },
        supportMultiple: false
    },
    ...pickerConfigs.getPickerSelectorTypes()
};

export const SelectorTypeResolvers = {
    Picker: options => pickerConfigs.getPickerSelectorType(options)
};
