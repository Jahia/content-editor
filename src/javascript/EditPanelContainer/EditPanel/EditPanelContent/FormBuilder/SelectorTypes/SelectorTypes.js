import Text from './Text';
import RichText from './RichText';
import MediaPicker from './MediaPicker';
import ChoiceList from './ChoiceList';
import TextArea from './TextArea';
import ContentPicker from './ContentPicker';

const PickerOptions = {
    image: MediaPicker
};

const SelectorTypes = {
    Text: () => Text,
    RichText: () => RichText,
    Picker: options => {
        return (options && PickerOptions[options.type]) || ContentPicker;
    },
    Choicelist: () => ChoiceList,
    TextArea: () => TextArea
};

export default SelectorTypes;
