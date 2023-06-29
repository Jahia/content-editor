import React, {useState} from 'react';
import {PickerDialog} from '~/SelectorTypes/Picker';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker.utils';
import {DefaultPickerConfig} from '~/SelectorTypes/Picker/configs/DefaultPickerConfig';
import {registry} from '@jahia/ui-extender';

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

    return picker && (
        <PickerDialog
            isOpen={Boolean(picker)}
            initialSelectedItem={picker?.value}
            site={picker?.site}
            pickerConfig={pickerConfig}
            lang={picker?.lang}
            isMultiple={picker?.isMultiple}
            onItemSelection={handleItemSelection}
            onClose={() => setPicker(false)}
        />
    );
};
