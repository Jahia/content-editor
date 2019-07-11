import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import * as PropTypes from 'prop-types';
import {Toggle} from '../../../../../../DesignSystem/Toggle';
import {FieldPropTypes} from '../../../../../FormDefinitions/FromData.proptypes';

const Checkbox = ({field, id, formik: {values, setFieldValue}}) => {
    return (
        <Toggle id={id}
                checked={values[field.formDefinition.name] === true}
                readOnly={field.formDefinition.readOnly}
                onChange={(event, checked) => setFieldValue(field.formDefinition.name, checked)}
        />
    );
};

Checkbox.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    formik: PropTypes.object.isRequired
};

export default compose(
    connect,
)(Checkbox);
