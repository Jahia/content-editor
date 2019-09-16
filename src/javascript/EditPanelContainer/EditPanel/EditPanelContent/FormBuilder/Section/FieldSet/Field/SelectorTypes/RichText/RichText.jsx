import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import CKEditor from 'ckeditor4-react';
CKEditor.displayName = 'CKEditor';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';

export class RichTextCmp extends React.Component {
    constructor(props) {
        super(props);

        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + '/ckeditor.js';
    }

    render() {
        const {field, id, value} = this.props;
        const {setFieldValue} = this.props.formik;

        const onEditorChange = evt => {
            setFieldValue(
                id,
                evt.editor.getData(),
                true
            );
        };

        const config = {
            toolbar: 'Mini',
            width: '100%',
            contentEditorFieldName: id // Used by selenium to get CKEditor instance
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
    }
}

RichTextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

const RichText = compose(connect)(RichTextCmp);
RichText.displayName = 'RichText';
export default RichText;
