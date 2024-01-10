import React, {useState} from 'react';
import {PickerDialog} from '~/SelectorTypes/Picker';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker.utils';
import {DefaultPickerConfig} from '~/SelectorTypes/Picker/configs/DefaultPickerConfig';
import {registry} from '@jahia/ui-extender';

function fillValue(value, initialSelectedItem) {
    if (typeof value === 'object') {
        initialSelectedItem.push(value);
    } else if (value.toLowerCase().startsWith('http')) {
        try {
            initialSelectedItem.push({fileUrl: new URL(value)});
        } catch {
        }
    } else if (value.startsWith('/')) {
        initialSelectedItem.push({path: value});
    } else {
        initialSelectedItem.push({uuid: value});
    }
}

export const ContentPickerApi = () => {
    const [picker, setPicker] = useState(false);

    const context = useContentEditorApiContext();

    context.openPicker = options => {
        setPicker(options);
    };

    window.CE_API = window.CE_API || {};
    window.CE_API.openPicker = context.openPicker;

    const pickerConfig = picker && mergeDeep({}, DefaultPickerConfig, registry.get('pickerConfiguration', picker.type) || registry.get('pickerConfiguration', 'editorial'));

    const handleItemSelection = pickerResult => {
        setPicker(false);
        picker.setValue(pickerResult);
    };

    const initialSelectedItem = [];
    if (picker?.value) {
        if (Array.isArray(picker.value)) {
            picker.value.forEach(value => fillValue(value, initialSelectedItem));
        } else {
            fillValue(picker.value, initialSelectedItem);
        }
    }

    return picker && (
        <PickerDialog
            isOpen={Boolean(picker)}
            initialSelectedItem={initialSelectedItem}
            site={picker?.site}
            pickerConfig={pickerConfig}
            lang={picker?.lang}
            uilang={picker?.uilang}
            isMultiple={picker?.isMultiple}
            onItemSelection={handleItemSelection}
            onClose={() => setPicker(false)}
        />
    );
};
