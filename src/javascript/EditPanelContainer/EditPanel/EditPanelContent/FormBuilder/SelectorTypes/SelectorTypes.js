import Text from './Text';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import TextArea from './TextArea';
import pickerConfig from './pickersConfig';
const SelectorTypes = {
    Text: () => {
        return {cmp: Text, key: 'Text'};
    },
    RichText: () => {
        return {cmp: RichText, key: 'RichText'};
    },
    Picker: options => pickerConfig.resolveComponent(options),
    Choicelist: () => {
        return {cmp: ChoiceList, key: 'ChoiceList'};
    },
    TextArea: () => {
        return {cmp: TextArea, key: 'TextArea'};
    }
};

export default SelectorTypes;
