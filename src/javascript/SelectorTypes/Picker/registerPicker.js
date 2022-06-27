import {ContentPickerSelectorType} from './ContentPicker/ContentPickerSelectorType';
import {MediaPickerSelectorType} from './MediaPicker/MediaPickerSelectorType';
import {registerPickerConfig} from './Picker.configs';
import {getPickerSelectorType} from './Picker.utils';
import {registerPickerActions} from './actions/registerPickerActions';

export const registerPicker = ceRegistry => {
    ceRegistry.add('selectorType', 'ContentPicker', {...ContentPickerSelectorType});
    ceRegistry.add('selectorType', 'MediaPicker', {...MediaPickerSelectorType});
    registerPickerConfig(ceRegistry);
    ceRegistry.add('selectorType', 'Picker', {resolver: options => getPickerSelectorType(options)});
    registerPickerActions(ceRegistry);
};
