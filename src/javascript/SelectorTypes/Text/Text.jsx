import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Input} from '@jahia/design-system-kit';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {Visibility, Hidden} from '@jahia/moonstone/dist/icons';

export const TextCmp = ({field, value, id, editorContext, onChange, onInit}) => {
    const [hidePassword, setHidePassword] = useState(true);

    const fieldType = field.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = editorContext.uilang === 'en' ? '.' : ',';
    const controlledValue = value === undefined ? '' : (isNumber ? value?.replace('.', decimalSeparator) : value);

    const isPassword = field.selectorOptions?.find(option => option.name === 'password');
    const InteractiveIcon = hidePassword ? Visibility : Hidden;
    const variant = isPassword && {
        interactive: <InteractiveIcon onClick={() => {
            setHidePassword(!hidePassword);
        }}/>
    };

    useEffect(() => {
        onInit(controlledValue);
    }, []);

    return (
        <Input
            fullWidth
            id={id}
            name={id}
            inputProps={{
                'aria-labelledby': `${field.name}-label`,
                'aria-required': field.mandatory
            }}
            value={controlledValue}
            readOnly={field.readOnly}
            type={isPassword && hidePassword ? 'password' : isNumber ? 'number' : 'text'}
            variant={variant}
            decimalScale={fieldType === 'LONG' ? 0 : undefined}
            decimalSeparator={decimalSeparator}
            onChange={evt => onChange(evt?.target?.value)}
        />
    );
};

TextCmp.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
};

const Text = TextCmp;
Text.displayName = 'Text';
export default Text;
