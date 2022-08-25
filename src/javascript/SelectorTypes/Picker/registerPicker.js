import {registerPickerConfig} from './configs/Picker2.configs';
import {registerPickerActions} from './actions/registerPickerActions';
import {Picker2} from './Picker2';
import {registerAccordionItems} from '~/SelectorTypes/Picker/accordionItems/accordionItems';
import {registerPickerReducer} from '~/SelectorTypes/Picker/Picker2.redux';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

export const getPickerSelectorType = (registry, options) => {
    const option = options && options.find(option => option.name === 'type');
    const pickerConfigKey = option?.value || 'default';

    let pickerConfig = registry.get(Constants.pickerConfig, pickerConfigKey);

    if (!pickerConfig) {
        console.warn('Picker configuration not found', pickerConfigKey);
        pickerConfig = registry.get(Constants.pickerConfig, 'default');
    } else if (pickerConfig.cmp) {
        console.warn('Legacy picker configuration found', pickerConfigKey);
        pickerConfig = registry.get(Constants.pickerConfig, 'default');
    }

    return ({
        cmp: Picker2,
        supportMultiple: true,
        key: 'Picker',
        pickerConfig
    });
};

export const registerPicker = registry => {
    registerPickerConfig(registry);
    registry.add('selectorType', 'Picker', {
        resolver: options => getPickerSelectorType(registry, options)
    });
    registerPickerActions(registry);
    registerAccordionItems(registry);
    registerPickerReducer(registry);
};
