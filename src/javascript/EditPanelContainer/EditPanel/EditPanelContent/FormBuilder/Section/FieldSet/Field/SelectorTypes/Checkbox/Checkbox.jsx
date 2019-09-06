import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import * as PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';

const Checkbox = ({field, value, id, formik: {setFieldValue}}) => {
    return (
        <Toggle id={id}
                checked={value === true}
                readOnly={field.readOnly}
                onChange={(event, checked) => setFieldValue(id, checked)}
        />
    );
};

Checkbox.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    formik: PropTypes.object.isRequired
};

export default compose(
    connect,
)(Checkbox);
