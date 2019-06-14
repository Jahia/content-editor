import Text from './Text';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import TextArea from './TextArea';
import DateTimePicker from './DateTimePicker';
import pickerConfigs from './Picker';
import Checkbox from './Checkbox';

const SelectorTypes = {
    Text: () => {
        return {cmp: Text, key: 'Text'};
    },
    RichText: () => {
        return {cmp: RichText, key: 'RichText'};
    },
    Picker: options => pickerConfigs.resolveComponent(options),
    Choicelist: () => {
        return {cmp: ChoiceList, key: 'ChoiceList'};
    },
    TextArea: () => {
        return {cmp: TextArea, key: 'TextArea'};
    },
    DateTimePicker: () => {
        return {cmp: DateTimePicker, key: 'DateTimePicker'};
    },
    DatePicker: () => {
        return {cmp: DateTimePicker, key: 'DatePicker'};
    },
    Checkbox: () => {
        return {cmp: Checkbox, key: 'Checkbox', formatValue: value => {
            return value === 'true'; // Value from JCR GraphQL API is a String
        }};
    }
};

export default SelectorTypes;
