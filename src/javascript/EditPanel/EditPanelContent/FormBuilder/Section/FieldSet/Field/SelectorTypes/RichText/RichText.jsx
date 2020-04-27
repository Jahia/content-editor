import React, {useContext, useEffect, useState} from 'react';
import CKEditor from 'ckeditor4-react';

CKEditor.displayName = 'CKEditor';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';
import {useQuery} from '@apollo/react-hooks';
import {ProgressOverlay} from '@jahia/react-material';
import {getCKEditorConfigurationPath} from './CKEditorConfiguration.gql-queries';
import {ContentEditorContext} from '~/ContentEditor.context';
import {PickerDialog} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/PickerDialog';
import {useTranslation} from 'react-i18next';
import {buildPickerContext, fillCKEditorPicker} from './RichText.utils';

function loadOption(selectorOptions, name) {
    return selectorOptions && selectorOptions.find(option => option.name === name);
}

export const RichTextCmp = ({field, id, value}) => {
    const {t} = useTranslation();
    const [picker, setPicker] = useState(false);
    useEffect(() => {
        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + 'ckeditor.js';
    });

    const editorContext = useContext(ContentEditorContext);
    const {data, error, loading} = useQuery(
        getCKEditorConfigurationPath,
        {
            variables: {
                nodePath: editorContext.path
            }
        }
    );

    if (error) {
        console.error(error);
        return <>{error}</>;
    }

    if (loading || !data || !data.forms) {
        return <ProgressOverlay/>;
    }

    const toolbar = loadOption(field.selectorOptions, 'ckeditor.toolbar');
    const customConfig = loadOption(field.selectorOptions, 'ckeditor.customConfig');

    let ckeditorCustomConfig = '';
    if (customConfig) {
        ckeditorCustomConfig = customConfig.value;
    } else {
        ckeditorCustomConfig = data.forms.ckeditorConfigPath;
    }

    const handlePickerDialog = (setUrl, type, params, dialog) => {
        setPicker({
            contentPicker: type === 'editoriallink',
            type,
            setUrl,
            params,
            dialog
        });
    };

    const config = {
        customConfig: ckeditorCustomConfig.replace('$context', window.contextJsParameters.contextPath),
        toolbar: toolbar ? toolbar.value : data.forms.ckeditorToolbar,
        width: '100%',
        contentEditorFieldName: id, // Used by selenium to get CKEditor instance
        filebrowserBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserImageBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'image', params, dialog),
        filebrowserFlashBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserLinkBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'editoriallink', params, dialog)
    };

    const {pickerConfig, nodeTreeConfigs, currentValue} = picker && buildPickerContext(picker, editorContext, t);
    const handleItemSelection = pickerResult => {
        setPicker(false);
        fillCKEditorPicker(picker, pickerResult);
    };

    return (
        <>
            {picker && <PickerDialog
                isOpen={Boolean(picker)}
                setIsOpen={setPicker}
                uilang={editorContext.uilang}
                lang={editorContext.lang}
                siteKey={editorContext.site}
                initialSelectedItem={currentValue}
                nodeTreeConfigs={nodeTreeConfigs}
                field={field}
                pickerConfig={pickerConfig}
                t={t}
                onItemSelection={handleItemSelection}
            />}
            <FastField
                name={field.name}
                render={({form: {setFieldValue, setFieldTouched}}) => {
                    const onEditorChange = value => {
                        setFieldValue(
                            id,
                            value,
                            true
                        );
                        setFieldTouched(field.name, field.multiple ? [true] : true);
                    };

                    return (
                        <CKEditor
                            id={id}
                            data={value}
                            aria-labelledby={`${field.name}-label`}
                            config={config}
                            readOnly={field.readOnly}
                            onMode={evt => {
                                if (evt.editor.mode === 'source') {
                                    let editable = evt.editor.editable();
                                    editable.attachListener(editable, 'input', inputEvt => onEditorChange(inputEvt.sender.getValue()));
                                }
                            }}
                            onChange={evt => onEditorChange(evt.editor.getData())}
                        />
                    );
                }}
            />
        </>
    );
};

RichTextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired
};

const RichText = RichTextCmp;
RichText.displayName = 'RichText';
export default RichText;
