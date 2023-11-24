import React, {useState} from 'react';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';
import {DamPickerDialog} from '../SelectorTypes/DamSelector_/PickerDialog';

export const DamPickerApi = () => {
    const [damPickerOptions, setDamPickerOptions] = useState(false);

    const context = useContentEditorApiContext();

    context.openDamPicker = options => {
        setDamPickerOptions(options);
    };

    window.CE_API = window.CE_API || {};
    window.CE_API.openDamPicker = context.openDamPicker;

    const handleItemSelection = damPickerResult => {
        setDamPickerOptions(false);
        damPickerOptions.setValue(damPickerResult);
    };

    return damPickerOptions && (
        <DamPickerDialog {...{
            isOpen: Boolean(damPickerOptions),
            onClose: () => setDamPickerOptions(false),
            site: damPickerOptions?.site,
            initialSelectedItem: damPickerOptions?.value,
            lang: damPickerOptions?.lang,
            isMultiple: damPickerOptions?.isMultiple,
            onItemSelection: handleItemSelection,
            type: damPickerOptions?.type
        }}/>
    );
};
