import Text from './Text';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import choiceListActions from './ChoiceList/ChoiceList.actions';
import TextArea from './TextArea';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';

const SelectorTypes = {
    Text: {cmp: Text, key: 'Text'},
    TextArea: {cmp: TextArea, key: 'TextArea'},
    RichText: {cmp: RichText, key: 'RichText'},
    Choicelist: {cmp: ChoiceList, key: 'Choicelist', actions: choiceListActions},
    DateTimePicker: {cmp: DateTimePicker, key: 'DateTimePicker'},
    DatePicker: {cmp: DateTimePicker, key: 'DatePicker'},
    Checkbox: {
        cmp: Checkbox,
        key: 'Checkbox',
        formatValue: value => {
            return value === 'true'; // Value from JCR GraphQL API is a String
        }
    },
    ...pickerConfigs.getPickerSelectorTypes()
};

const SelectorTypeResolvers = {
    Picker: options => pickerConfigs.getPickerSelectorType(options)
};

const resolveSelectorType = (key, options) => {
    if (SelectorTypes[key]) {
        return SelectorTypes[key];
    }

    if (SelectorTypeResolvers[key]) {
        return SelectorTypeResolvers[key](options);
    }
};

export default {
    selectorTypes: SelectorTypes,
    resolveSelectorType: resolveSelectorType
};
