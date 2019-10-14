import React from 'react';
import PropTypes from 'prop-types';
import {FastField} from 'formik';
import {TextArea} from '~/DesignSystem/TextArea';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

export const TextAreaField = ({id, field}) => {
    return (
        <FastField
            name={id}
            render={({field: {name, value, onChange}, form: {setFieldTouched}}) => {
                const handleChange = evt => {
                    onChange(evt);
                    setFieldTouched(field.name, field.multiple ? [true] : true);
                };

                return (
                    <TextArea id={id}
                              name={name}
                              aria-labelledby={`${field.name}-label`}
                              value={value || ''}
                              disabled={field.readOnly}
                              onChange={handleChange}
                    />
                );
            }}
        />

    );
};

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired
};
