import React from 'react';
import CKEditor from 'ckeditor4-react';
CKEditor.displayName = 'CKEditor';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/EditPanelContainer/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';

export class RichTextCmp extends React.Component {
    constructor(props) {
        super(props);

        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + '/ckeditor.js';
    }

    render() {
        const {field, id, value} = this.props;

        const config = {
            toolbar: 'Mini',
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
                        setFieldTouched(id, true);
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
