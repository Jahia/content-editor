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
        const {field, id} = this.props;
        const {values, setFieldValue} = this.props.formik;

        const onEditorChange = evt => {
            setFieldValue(
                field.name,
                evt.editor.getData(),
                true
            );
        };

        const config = {
            toolbar: 'Mini',
            contentEditorFieldName: field.name // Used by selenium to get CKEditor instance
        };

        return (
            <CKEditor
                    id={id}
                    data={values[field.name]}
                    config={config}
                    readOnly={field.readOnly}
                    onChange={onEditorChange}
                />
        );
    }
}

RichTextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

const RichText = compose(connect)(RichTextCmp);
RichText.displayName = 'RichText';
export default RichText;
