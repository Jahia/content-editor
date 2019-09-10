import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'formik';
import PropTypes from 'prop-types';
import {Input} from '@jahia/design-system-kit';
import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';

export const TextCmp = ({field, value, id, editorContext, formik: {handleChange, handleFocus}}) => {
    const fieldType = field.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = editorContext.uiLang === 'en' ? '.' : ',';
    const controlledValue = value === undefined ? '' : value;

    return (
        <Input
            fullWidth
            id={id}
            name={id}
            value={isNumber ? controlledValue && controlledValue.replace('.', decimalSeparator) : controlledValue}
            readOnly={field.readOnly}
            type={isNumber ? 'number' : 'text'}
            decimalScale={fieldType === 'LONG' ? 0 : undefined}
            decimalSeparator={decimalSeparator}
            onChange={handleChange}
            onFocus={handleFocus}
        />
    );
};

TextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

const Text = compose(connect)(TextCmp);
Text.displayName = 'Text';
export default Text;
