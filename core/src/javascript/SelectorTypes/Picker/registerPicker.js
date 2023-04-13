import {registerPickerConfig} from './configs/Picker.configs';
import {registerPickerActions} from './actions/registerPickerActions';
import {Picker} from './Picker';
import {registerPickerReducer} from '~/SelectorTypes/Picker/Picker.redux';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';

/**
 * If picker type is not specified, infer based on field value constraints
 * and match against picker config selectable types (selectableTypesTable attribute).
 *
 * @param registry
 * @param field
 * @returns picker config that matches field value constraints, or default picker config
 */
const inferPickerConfig = (registry, field) => {
    const pickerConfigs = registry.find({type: Constants.pickerConfig});
    const constraints = field.valueConstraints?.map(c => c.displayValue) || [];
    const pickerConfig = pickerConfigs.find(config => {
        const selectorTypes = config.selectableTypesTable;
        // Check if selectorTypes matches field constraints
        return (selectorTypes?.length > 0) &&
            constraints.length === selectorTypes.length &&
            selectorTypes.every(type => constraints.indexOf(type) > -1);
    });
    return pickerConfig || registry.get(Constants.pickerConfig, 'default');
};

export const getPickerSelectorType = (registry, options, field) => {
    const option = options && options.find(option => option.name === 'type');
    let pickerConfigKey = option?.value;
    let pickerConfig = (pickerConfigKey) ?
        registry.get(Constants.pickerConfig, pickerConfigKey) :
        inferPickerConfig(registry, field);

    if (!pickerConfig) {
        console.warn('Picker configuration not found', pickerConfigKey);
        pickerConfig = registry.get(Constants.pickerConfig, 'default');
    } else if (pickerConfig.cmp) {
        console.warn('Legacy picker configuration found', pickerConfigKey);
        pickerConfig = registry.get(Constants.pickerConfig, 'default');
    }

    return ({
        cmp: Picker,
        supportMultiple: true,
        key: 'Picker',
        pickerConfig
    });
};

export const registerPicker = registry => {
    registerPickerConfig(registry);
    registry.add('selectorType', 'Picker', {
        dataType: ['WeakReference'],
        labelKey: 'content-editor:label.contentEditor.selectorTypes.picker.displayValue',
        properties: [
            {name: 'description', value: 'content-editor:label.contentEditor.selectorTypes.picker.description'},
            {name: 'iconStart', value: 'WeakReference'}
        ],
        resolver: (options, field) => getPickerSelectorType(registry, options, field)
    });
    registerPickerActions(registry);
    registerPickerReducer(registry);
};
