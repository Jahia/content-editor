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
        const option = options && options.find(option => option.name === 'type' && PickerOptions[option.value]);
        return (option && PickerOptions[option.value]) || ContentPicker;
    },
    Choicelist: () => ChoiceList,
    TextArea: () => TextArea
};

export default SelectorTypes;
