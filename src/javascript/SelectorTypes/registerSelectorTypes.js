import {registerSelectorTypesOnChange} from './registerSelectorTypesOnChange';
import {registerChoiceList} from './ChoiceList';
import {registerTag} from './Tag';
import {registerText} from './Text';
import {registerCategory} from './Category';
import {registerTextArea} from './TextAreaField';
import {registerRichText} from './RichText';
import {registerColor} from './Color';
import {registerDateTimePicker} from './DateTimePicker';
import {registerCheckbox} from './Checkbox';
import {registerPicker} from './Picker';
import {registerSystemName} from './SystemName';

export const registerSelectorTypes = ceRegistry => {
    registerSelectorTypesOnChange(ceRegistry);

    registerCategory(ceRegistry);
    registerTag(ceRegistry);
    registerText(ceRegistry);
    registerTextArea(ceRegistry);
    registerRichText(ceRegistry);
    registerColor(ceRegistry);
    registerDateTimePicker(ceRegistry);
    registerCheckbox(ceRegistry);
    registerPicker(ceRegistry);
    registerChoiceList(ceRegistry);
    registerSystemName(ceRegistry);
};

