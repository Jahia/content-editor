import React from 'react';
import CKEditor from 'ckeditor4-react';
CKEditor.displayName = 'CKEditor';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';

function loadOption(selectorOptions, name) {
    return selectorOptions && selectorOptions.find(option => option.name === name);
}

export class RichTextCmp extends React.Component {
    constructor(props) {
        super(props);

        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + 'ckeditor.js';
    }

    render() {
        const {field, id, value} = this.props;

        const toolbar = loadOption(field.selectorOptions, 'ckeditor.toolbar');
        const customConfig = loadOption(field.selectorOptions, 'ckeditor.customConfig');

        const config = {
            customConfig: customConfig ? customConfig.value.replace('$context', window.contextJsParameters.contextPath) : '',
            toolbar: toolbar ? toolbar.value : 'Mini',
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
    }
}

RichTextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired
};

const RichText = RichTextCmp;
RichText.displayName = 'RichText';
export default RichText;
