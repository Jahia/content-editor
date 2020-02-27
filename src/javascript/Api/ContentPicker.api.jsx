import React, {useState} from 'react';
import {PickerDialog} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/PickerDialog';
import pickerConfigs from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker';
import {getNodeTreeConfigs} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/Picker.utils';
import {useTranslation} from 'react-i18next';

const ContentPickerApiCmp = () => {
    const {t} = useTranslation();
    const [dialog, setDialog] = useState(false);
    window.CE_API.openPicker = (path, pickerType, uilang, lang, siteKey, siteTitle, multiple) => {
        setDialog({path, pickerType, uilang, lang, siteKey, siteTitle, multiple});
    };

    if (!dialog) {
        return <></>;
    }

    const config = pickerConfigs[dialog.pickerType];
    if (!config) {
        console.error(`unable to find configuration ${dialog.pickerType}`);
        return <></>;
    }

    const pickerConfig = {...config, displayTree: true};
    const nodeTreeConfigs = getNodeTreeConfigs(pickerConfig, dialog.site, dialog.siteTitle, t);
    return (
        <PickerDialog
            isOpen={Boolean(dialog)}
            setIsOpen={setDialog}
            uilang={dialog.uilang}
            lang={dialog.lang}
            siteKey={dialog.siteKey}
            initialSelectedItem={dialog.path}
            nodeTreeConfigs={nodeTreeConfigs}
            field={{multiple: dialog.multiple}}
            pickerConfig={pickerConfig}
            t={t}
            onItemSelection={data => console.log(data)}
        />
    );
};

export default ContentPickerApiCmp;
