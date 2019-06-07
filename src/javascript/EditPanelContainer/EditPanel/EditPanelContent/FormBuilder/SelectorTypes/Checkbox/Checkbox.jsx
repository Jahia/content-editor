import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import * as PropTypes from 'prop-types';
import {Toggle} from '../../../../../../DesignSystem/Toggle';

const Checkbox = ({field, id, formik: {values, setFieldValue, handleBlur}}) => {
    return (
        <Toggle id={id}
                checked={values[field.formDefinition.name] === true}
                readOnly={field.formDefinition.readOnly}
                onChange={(event, checked) => setFieldValue(field.formDefinition.name, checked)}
                onBlur={handleBlur}
        />
    );
};

Checkbox.propTypes = {
    field: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired
};

export default compose(
    connect,
)(Checkbox);
