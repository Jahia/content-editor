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
import pickerConfigs from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker';
import {getNodeTreeConfigs} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/Picker/Picker.utils';
import {useTranslation} from 'react-i18next';

const contextPath = (window.contextJsParameters && window.contextJsParameters.contextPath) || '';

const contentPrefix = `${contextPath}/cms/{mode}/{lang}`;
const filePrefix = `${contextPath}/files/{workspace}`;

function loadOption(selectorOptions, name) {
    return selectorOptions && selectorOptions.find(option => option.name === name);
}

function buildPickerContext(picker, editorContext, t) {
    const pickerConfig = {...(pickerConfigs[picker.type] || pickerConfigs.editorial), displayTree: true};
    const nodeTreeConfigs = getNodeTreeConfigs(pickerConfig, editorContext.site, editorContext.siteInfo.displayName, t);
    let currentValue = '';

    // Find "URL" input in CKEditor dialog.
    const hasUrl = picker.dialog.getContentElement('info', 'url');
    const elt = hasUrl ? 'url' : 'txtUrl';
    if (picker.dialog && picker.dialog.getContentElement('info', elt)) {
        currentValue = picker.dialog.getContentElement('info', elt).getValue();
        // Remove Jahia link wrappers to get path
        if (currentValue.startsWith(contentPrefix)) {
            currentValue = currentValue.substr(contentPrefix.length);
            currentValue = currentValue.slice(0, -('.html').length);
        } else {
            currentValue = currentValue.substr(filePrefix.length);
        }
    }

    return {pickerConfig, nodeTreeConfigs, currentValue};
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
    console.log(picker);

    let {pickerConfig, nodeTreeConfigs, currentValue} = picker && buildPickerContext(picker, editorContext, t);

    console.log(currentValue);

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
                onItemSelection={pickerResult => {
                    setPicker(false);
                    // Fill Dialog alt title
                    const hasUrl = picker.dialog.getContentElement('info', 'url');
                    const hasTxtUrl = picker.dialog.getContentElement('info', 'txtUrl');

                    const advTitle = hasUrl ? picker.dialog.getContentElement('info', 'advTitle') : (hasTxtUrl ? picker.dialog.getContentElement('info', 'txtAlt') : null);
                    if (advTitle) {
                        advTitle.setValue(pickerResult.name);
                    }

                    // Wrap path to build Jahia url.
                    picker.setUrl(`${picker.contentPicker ? contentPrefix : filePrefix}${pickerResult.path}${picker.contentPicker ? '.html' : ''}`, {});
                }}
            />}
            <FastField
                name={field.name}
                render={({form: {setFieldValue, setFieldTouched}}) => {
                    const onEditorChange = evt => {
                        setFieldValue(
                            id,
                            evt.editor.getData(),
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
                            onChange={onEditorChange}
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
