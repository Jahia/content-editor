import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Input} from '@jahia/design-system-kit';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {Hidden, Visibility} from '@jahia/moonstone';
import {useSelector} from 'react-redux';

export const Text = ({field, value, id, onChange, onBlur}) => {
    const [hidePassword, setHidePassword] = useState(true);

    const uilang = useSelector(state => state.uilang);
    const fieldType = field.requiredType;
    const isNumber = fieldType === 'DOUBLE' || fieldType === 'LONG' || fieldType === 'DECIMAL';
    const decimalSeparator = uilang === 'en' ? '.' : ',';
    const controlledValue = value === undefined ? '' : (isNumber ? value?.replace('.', decimalSeparator) : value);

    const isPassword = field.selectorOptions?.find(option => option.name === 'password');
    const InteractiveIcon = hidePassword ? Visibility : Hidden;
    const variant = isPassword && {
        interactive: <InteractiveIcon onClick={() => {
            setHidePassword(!hidePassword);
        }}/>
    };

    const maxLength = field.selectorOptions?.find(option => option.name === 'maxLength');
    return (
        <Input
            fullWidth
            id={id}
            name={id}
            inputProps={{
                'aria-labelledby': `${field.name}-label`,
                'aria-required': field.mandatory,
                maxLength: maxLength && maxLength.value
            }}
            value={controlledValue}
            readOnly={field.readOnly}
            type={isPassword && hidePassword ? 'password' : isNumber ? 'number' : 'text'}
            variant={variant}
            decimalScale={fieldType === 'LONG' ? 0 : undefined}
            decimalSeparator={decimalSeparator}
            onChange={evt => onChange(evt?.target?.value)}
            onBlur={onBlur}
        />
    );
};

Text.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func
};

Text.displayName = 'Text';
