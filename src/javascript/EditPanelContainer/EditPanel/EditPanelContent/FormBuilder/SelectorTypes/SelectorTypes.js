import Text from './Text';
import RichText from './RichText';
import MediaPicker from './MediaPicker';
import ChoiceList from './ChoiceList';
import TextArea from './TextArea';

const SelectorTypes = {
    Text: Text,
    RichText: RichText,
    Picker: MediaPicker,
    Choicelist: ChoiceList,
    TextArea
};

export default SelectorTypes;
