import Text from './Text';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import TextArea from './TextArea';
import pickerConfig from './pickersConfig';
const SelectorTypes = {
    Text: () => Text,
    RichText: () => RichText,
    Picker: options => pickerConfig.resolveComponent(options),
    Choicelist: () => ChoiceList,
    TextArea: () => TextArea
};

export default SelectorTypes;
