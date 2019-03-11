import React from 'react';
import FieldTypes from './FieldTypes';
import {connect} from 'formik';
import {Paper} from '@material-ui/core';
import * as PropTypes from 'prop-types';

export class FormBuilder extends React.Component {
    render() {
        let {fields, formik} = this.props;
        return (
            <form onSubmit={formik.handleSubmit}>
                <Paper elevation={1}>
                    {fields.map(field => {
                        let FieldComponent = FieldTypes[field.formDefinition.fieldType];
                        return FieldComponent && <FieldComponent key={field.formDefinition.name} field={field}/>;
                    })}
                </Paper>
            </form>
        );
    }
}

FormBuilder.propTypes = {
    fields: PropTypes.array.isRequired,
    formik: PropTypes.object.isRequired
};

export default connect(FormBuilder);
