import React from 'react';
import PropTypes from 'prop-types';
import {FastField} from 'formik';
import {TextArea} from '~/DesignSystem/TextArea';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

export const TextAreaField = ({id, field, onChange}) => {
    return (
        <FastField
            name={id}
            render={({field: {name, value, onChange: onFormikChange}, form: {setFieldTouched}}) => {
                const handleChange = evt => {
                    onFormikChange(evt);
                    setFieldTouched(field.name, field.multiple ? [true] : true);
                    onChange(value, evt?.target?.value);
                };

                return (
                    <TextArea id={id}
                              name={name}
                              aria-labelledby={`${field.name}-label`}
                              value={value || ''}
                              readOnly={field.readOnly}
                              onChange={handleChange}
                    />
                );
            }}
        />
    );
};

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired
};
