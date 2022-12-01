import React, {useContext, useEffect, useState} from 'react';
import CKEditor from 'ckeditor4-react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {useQuery} from '@apollo/react-hooks';
import {getCKEditorConfigurationPath} from './CKEditorConfiguration.gql-queries';
import {ContentEditorContext, useContentEditorContext} from '~/contexts';
import {PickerDialog} from '~/SelectorTypes/Picker';
import {useTranslation} from 'react-i18next';
import {buildPickerContext, fillCKEditorPicker} from './RichText.utils';
import {LoaderOverlay} from '~/DesignSystem/LoaderOverlay';
import {
    createBlockquotePlugin,
    createBoldPlugin,
    createCodeBlockPlugin,
    createCodePlugin,
    createHeadingPlugin,
    createItalicPlugin,
    createParagraphPlugin,
    createPlugins,
    createStrikethroughPlugin,
    createUnderlinePlugin,
    Plate,
    PlateProvider,
} from '@udecode/plate';
import basicMarksValue from './plate-demo/basicMarksValue';
import basicElementsValue from './plate-demo/basicElementsValue';
import {plateUI} from './plate-demo/plateUI';
import './RichText.scss';

if (window.CKEDITOR) {
    window.CKEDITOR.focusManager._.blurDelay = 0;
}

CKEditor.displayName = 'CKEditor';

function loadOption(selectorOptions, name) {
    return selectorOptions && selectorOptions.find(option => option.name === name);
}

export const RichText = ({field, id, value, onChange, onBlur}) => {
    const {t} = useTranslation('content-editor');
    const [picker, setPicker] = useState(false);
    const {i18nContext} = useContentEditorContext();

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

    const toolbar = loadOption(field.selectorOptions, 'ckeditor.toolbar');
    const customConfig = loadOption(field.selectorOptions, 'ckeditor.customConfig');

    // Delete the config set by GWTInitializer, as it may be wrong (Wrong site detection into DX, we will set it manually after)
    if (window.contextJsParameters && window.contextJsParameters.ckeCfg) {
        delete window.contextJsParameters.ckeCfg;
    }

    let ckeditorCustomConfig = '';
    if (customConfig && customConfig.value) {
        // Custom config from CND
        ckeditorCustomConfig = customConfig.value.replace('$context', window.contextJsParameters.contextPath);
    } else if (data.forms.ckeditorConfigPath) {
        ckeditorCustomConfig = data.forms.ckeditorConfigPath.replace('$context', window.contextJsParameters.contextPath);

        // Custom config coming from the template set, let's populate the contextJsParameters for retro compatibility
        if (ckeditorCustomConfig) {
            if (window.contextJsParameters) {
                window.contextJsParameters.ckeCfg = ckeditorCustomConfig;
            }
        }
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
        customConfig: ckeditorCustomConfig,
        toolbar: toolbar ? toolbar.value : data.forms.ckeditorToolbar,
        width: '100%',
        contentEditorFieldName: id, // Used by selenium to get CKEditor instance
        filebrowserBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserImageBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'image', params, dialog),
        filebrowserFlashBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'file', params, dialog),
        filebrowserLinkBrowseUrl: (dialog, params, setUrl) => handlePickerDialog(setUrl, 'editoriallink', params, dialog)
    };

    const {pickerConfig, pickerValue} = picker && buildPickerContext(picker, editorContext, t);
    const handleItemSelection = pickerResult => {
        setPicker(false);
        fillCKEditorPicker(picker, pickerResult.length > 0 && pickerResult[0]);
    };

    /** START Plate - Slate.js demo */

    const editableProps = {
        spellCheck: false,
        autoFocus: false,
        readOnly: false,
        placeholder: 'Type…',
    };

    const plugins = [
        createParagraphPlugin(),
        createBlockquotePlugin(),
        createCodeBlockPlugin(),
        createHeadingPlugin(),

        createBoldPlugin(),
        createItalicPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createCodePlugin(),
    ];
    const pluginsComp = createPlugins(plugins, {components: plateUI});


    /** END Plate - Slate.js demo */

    return (
        <>
            {picker && <PickerDialog
                isOpen={Boolean(picker)}
                initialSelectedItem={pickerValue}
                editorContext={editorContext}
                field={field}
                pickerConfig={pickerConfig}
                onItemSelection={handleItemSelection}
                onClose={() => setPicker(false)}
            />}

            <PlateProvider
                initialValue={[...basicElementsValue, ...basicMarksValue]}
                plugins={pluginsComp}
            >
                <Plate editableProps={editableProps} />
            </PlateProvider>



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

