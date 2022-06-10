import React from 'react';
import * as PropTypes from 'prop-types';
import {Toggle} from '@jahia/design-system-kit';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

export const Checkbox = ({field, value, id, onChange, onBlur}) => {
    return (
        <Toggle id={id}
                inputProps={{
                    'aria-labelledby': `${field.name}-label`
                }}
                checked={value === true}
                readOnly={field.readOnly}
                onChange={(evt, checked) => onChange(checked)}
                onBlur={onBlur}
        />
    );
};

Checkbox.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
