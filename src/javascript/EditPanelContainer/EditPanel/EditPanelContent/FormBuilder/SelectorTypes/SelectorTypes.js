import Text from './Text';
import RichText from './RichText';
import MediaPicker from './MediaPicker';
import ChoiceList from './ChoiceList';

const SelectorTypes = {
    Text: Text,
    RichText: RichText,
    Picker: MediaPicker,
    Choicelist: ChoiceList
};

export default SelectorTypes;
