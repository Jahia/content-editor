import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import MultipleLeftRightSelectorDnd from './MultipleLeftRightSelectorDnd';

const toArray = value => (Array.isArray(value) ? value : [value]);

export const MultipleLeftRightSelector = ({field, onChange, value}) => {
    const arrayValue = value ? toArray(value) : [];

    // Reset selection if previously selected option no longer available
    useEffect(() => {
        if (arrayValue && arrayValue.length > 0) {
            const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const actualValues = arrayValue.filter(v => availableValues.includes(v));
            if (actualValues.length !== arrayValue.length) {
                onChange(actualValues);
            }
        }
    }, [value, onChange]); // eslint-disable-line

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    const readOnly = field.readOnly || field.valueConstraints.length === 0;

    return <MultipleLeftRightSelectorDnd readOnly={readOnly} arrayValue={arrayValue} options={options} onChange={onChange}/>;
};

MultipleLeftRightSelector.propTypes = {
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOf([PropTypes.string, PropTypes.array])
};

export default MultipleLeftRightSelector;
