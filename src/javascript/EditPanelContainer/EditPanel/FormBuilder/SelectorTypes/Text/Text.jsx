import React from 'react';
import {Input} from '@material-ui/core';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import * as PropTypes from 'prop-types';

export class Text extends React.Component {
    render() {
        let {field, id} = this.props;
        let {values, handleChange, handleBlur} = this.props.formik;

        return (
            <Input
                fullWidth
                id={id}
                name={field.formDefinition.name}
                value={values[field.formDefinition.name]}
                readOnly={field.formDefinition.readOnly}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        );
    }
}

Text.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export default compose(
    connect,
)(Text);
