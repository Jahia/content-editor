import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import CKEditor from 'ckeditor4-react';
import * as PropTypes from 'prop-types';

export class RichText extends React.Component {
    constructor(props) {
        super(props);

        CKEditor.editorUrl = window.CKEDITOR_BASEPATH + '/ckeditor.js';
    }

    render() {
        const {field} = this.props;
        const {values, setFieldValue} = this.props.formik;

        const onEditorChange = evt => {
            setFieldValue(
                field.formDefinition.name,
                evt.editor.getData(),
                true
            );
        };

        return (
            <CKEditor
                    data={values[field.formDefinition.name]}
                    config={{toolbar: 'Mini'}}
                    readOnly={field.formDefinition.readOnly}
                    onChange={onEditorChange}
                />
        );
    }
}

RichText.propTypes = {
    field: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export default compose(connect)(RichText);
