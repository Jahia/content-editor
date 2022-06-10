import React from 'react';
import PropTypes from 'prop-types';

import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {ColorPickerInput} from '~/DesignSystem/ColorPickerInput';

export const Color = ({id, field, value, onChange, onBlur}) => {
    return (
        <ColorPickerInput
            initialValue={value}
            readOnly={field.readOnly}
            id={id}
            inputProps={{
                'aria-labelledby': `${field.name}-label`,
                'aria-required': field.mandatory
            }}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

Color.defaultProps = {
    value: ''
};

Color.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
