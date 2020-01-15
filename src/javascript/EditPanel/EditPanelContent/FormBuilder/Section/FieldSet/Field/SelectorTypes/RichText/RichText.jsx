import React, {useContext, useEffect} from 'react';
import CKEditor from 'ckeditor4-react';
CKEditor.displayName = 'CKEditor';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';
import {useQuery} from 'react-apollo-hooks';
import {ProgressOverlay} from '@jahia/react-material';
import {getCKEditorConfigurationPath} from './CKEditorConfiguration.gql-queries';
import {ContentEditorContext} from '~/ContentEditor.context';

function loadOption(selectorOptions, name) {
    return selectorOptions && selectorOptions.find(option => option.name === name);
}

export const RichTextCmp = ({field, id, value}) => {
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

    const config = {
        customConfig: ckeditorCustomConfig.replace('$context', window.contextJsParameters.contextPath),
        toolbar: toolbar ? toolbar.value : data.forms.ckeditorToolbar,
        width: '100%',
        contentEditorFieldName: id // Used by selenium to get CKEditor instance
    };

    return (
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
