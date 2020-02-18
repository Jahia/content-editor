import React from 'react';
import PropTypes from 'prop-types';
import {Input} from '@jahia/design-system-kit';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FastField} from 'formik';

export const TextCmp = ({field, value, id, editorContext}) => {
    const fieldType = field.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = editorContext.uilang === 'en' ? '.' : ',';
    const controlledValue = value === undefined ? '' : value;
    return (
        <FastField render={({form: {handleChange, setFieldTouched}}) => {
            const onChange = evt => {
                handleChange(evt);
                setFieldTouched(field.name, field.multiple ? [true] : true);
            };

            return (
                <Input
                    fullWidth
                    id={id}
                    name={id}
                    inputProps={{
                        'aria-labelledby': `${field.name}-label`,
                        'aria-required': field.mandatory
                    }}
                    value={isNumber ? controlledValue && controlledValue.replace('.', decimalSeparator) : controlledValue}
                    readOnly={field.readOnly}
                    type={isNumber ? 'number' : 'text'}
                    decimalScale={fieldType === 'LONG' ? 0 : undefined}
                    decimalSeparator={decimalSeparator}
                    onChange={onChange}
                />
            );
        }}
        />
    );
};

TextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired
};

const Text = TextCmp;
Text.displayName = 'Text';
export default Text;
