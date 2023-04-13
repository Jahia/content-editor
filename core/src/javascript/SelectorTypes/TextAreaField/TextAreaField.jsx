import React from 'react';
import PropTypes from 'prop-types';
import {TextArea} from '~/DesignSystem/TextArea';
import {FieldPropTypes} from '~/ContentEditor.proptypes';

export const TextAreaField = ({id, value, field, onChange, onBlur}) => {
    return (
        <TextArea id={id}
                  name={id}
                  aria-labelledby={`${field.name}-label`}
                  value={value || ''}
                  readOnly={field.readOnly}
                  onChange={evt => onChange(evt?.target?.value)}
                  onBlur={onBlur}
        />
    );
};

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
