import React from 'react';
import * as PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const Checkbox = ({field, value, id, onChange}) => {
    return (
        <Toggle id={id}
                inputProps={{
                    'aria-labelledby': `${field.name}-label`
                }}
                checked={value === true}
                readOnly={field.readOnly}
                onChange={(evt, checked) => onChange(checked)}
        />
    );
};

Checkbox.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
};

export default Checkbox;
