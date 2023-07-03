import React, {useContext, useEffect} from 'react';
import CKEditor from 'ckeditor4-react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {useQuery} from '@apollo/react-hooks';
import {getCKEditorConfigurationPath} from './CKEditorConfiguration.gql-queries';
import {ContentEditorContext, useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import {useTranslation} from 'react-i18next';
import {fillCKEditorPicker, getPickerValue} from './RichText.utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import './RichText.scss';
import {useContentEditorApiContext} from '~/contexts/ContentEditorApi/ContentEditorApi.context';

if (window.CKEDITOR) {
    window.CKEDITOR.focusManager._.blurDelay = 0;
}

CKEditor.displayName = 'CKEditor';

export const RichText = ({field, id, value, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const api = useContentEditorApiContext();
    const {i18nContext} = useContentEditorContext();
    const {lang} = useContentEditorConfigContext();

    useEffect(() => {
        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + 'ckeditor.js';
    }, []);

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
        const message = t(
            'content-editor:label.contentEditor.error.queryingContent',
            {details: editorContext.path}
        );
        return <>{message}</>;
    }

    if (loading || !data || !data.forms) {
        return <LoaderOverlay/>;
    }

    const definitionConfig = {};
    const CK_EDITOR_PREFIX = 'ckeditor.';
    field.selectorOptions
        .filter(option => option.name.startsWith(CK_EDITOR_PREFIX))
        .forEach(option => {
            definitionConfig[option.name.substring(CK_EDITOR_PREFIX.length)] = option.value;
        });

    // Resolve Toolbar
    definitionConfig.toolbar = definitionConfig.toolbar || data.forms.ckeditorToolbar;

    // Delete the config set by GWTInitializer, as it may be wrong (Wrong site detection into DX, we will set it manually after)
    if (window.contextJsParameters && window.contextJsParameters.ckeCfg) {
        delete window.contextJsParameters.ckeCfg;
    }

    if (definitionConfig.customConfig) {
        // Custom config from CND
        definitionConfig.customConfig = definitionConfig.customConfig.replace('$context', window.contextJsParameters.contextPath);
    } else if (data.forms.ckeditorConfigPath) {
        definitionConfig.customConfig = data.forms.ckeditorConfigPath.replace('$context', window.contextJsParameters.contextPath);

        // Custom config coming from the template set, let's populate the contextJsParameters for retro compatibility
        if (definitionConfig.customConfig && window.contextJsParameters) {
            window.contextJsParameters.ckeCfg = definitionConfig.customConfig;
        }
    }

    const handlePickerDialog = (setUrl, type, params, dialog) => {
        const value = getPickerValue(dialog);

        api.openPicker({
            type,
            value,
            setValue: pickerResult => {
                fillCKEditorPicker(setUrl, dialog, type === 'editoriallink', pickerResult.length > 0 && pickerResult[0]);
            },
            site: editorContext.site,
            lang
        });
    };

    const config = {
        customConfig: '',
        width: '100%',
        contentEditorFieldName: id, // Used by selenium to get CKEditor instance
        filebrowserBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserImageBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'image', params, dialog),
        filebrowserFlashBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserLinkBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'editoriallink', params, dialog),
        disableNativeSpellChecker: false,
        baseFloatZIndex: 1000,
        ...definitionConfig
    };

    return (
        <>
            <CKEditor
                key={'v' + (i18nContext?.memo?.count || 0)}
                id={id}
                data={value}
                aria-labelledby={`${field.name}-label`}
                config={config}
                readOnly={field.readOnly}
                onMode={evt => {
                    if (evt.editor.mode === 'source') {
                        let editable = evt.editor.editable();
                        editable.attachListener(editable, 'input', inputEvt => onChange(inputEvt.sender.getValue()));
                    } else {
                        let element = document.querySelector('div[data-first-field=true] .cke_wysiwyg_frame');
                        if (element) {
                            element.contentDocument.querySelector('.cke_editable').focus();
                        }
                    }
                }}
                onChange={evt => onChange(evt.editor.getData())}
                onBlur={onBlur}
            />
        </>
    );
};

RichText.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

