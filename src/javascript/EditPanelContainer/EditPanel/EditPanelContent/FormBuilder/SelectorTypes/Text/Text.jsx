import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import PropTypes from 'prop-types';
import {Input} from '../../../../../../DesignSystem/Input';

export const Text = ({field, id, editorContext, formik: {values, handleChange, handleBlur}}) => {
    const fieldType = field.jcrDefinition.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = editorContext.uiLang === 'en' ? '.' : ',';
    const value = values[field.formDefinition.name];

    return (
        <Input
            fullWidth
            id={id}
            name={field.formDefinition.name}
            defaultValue={isNumber ? value && value.replace('.', decimalSeparator) : value}
            readOnly={field.formDefinition.readOnly}
            type={isNumber ? 'number' : 'text'}
            decimalScale={fieldType === 'LONG' ? 0 : undefined}
            decimalSeparator={decimalSeparator}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

Text.propTypes = {
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export default compose(
    connect
)(Text);
