import {registerPickerConfig} from './configs/Picker2.configs';
import {registerPickerActions} from './actions/registerPickerActions';
import {Picker2} from './Picker2';
import {registerAccordionItems} from '~/SelectorTypes/Picker/accordionItems/registerAccordionItems';
import {registerPickerReducer} from '~/SelectorTypes/Picker/Picker2.redux';

export const getPickerSelectorType = (registry, options) => {
    const option = options && options.find(option => option.name === 'type');
    const pickerConfigKey = option?.value || 'editorial';

    let pickerConfig = registry.get('pickerConfiguration', pickerConfigKey);

    if (!pickerConfig) {
        console.warn('Picker configuration not found', pickerConfigKey);
        pickerConfig = registry.get('pickerConfiguration', 'editorial');
    } else if (pickerConfig.cmp) {
        console.warn('Legacy picker configuration found', pickerConfigKey);
        pickerConfig = registry.get('pickerConfiguration', 'editorial');
    }

    return ({
        cmp: Picker2,
        supportsMultiple: false,
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
