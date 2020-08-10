import React from 'react';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const MultipleSelect = ({field, id, value, setActionContext, onChange}) => {
    setActionContext({
        onChange
    });

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    const readOnly = field.readOnly || field.valueConstraints.length === 0;
    // Reset value if constraints doesnt contains the actual value.
    if (value && value.length > 0) {
        const availableValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
        const actualValues = value.filter(v => availableValues.includes(v));
        if (actualValues.length !== value.length) {
            onChange(actualValues);
        }
    }

    return (
        <MultipleInput
            id={id}
            options={options}
            value={value && options.filter(data => value.includes(data.value))}
            readOnly={readOnly}
            inputProps={{
                'data-sel-content-editor-select-readonly': readOnly
            }}
            onChange={selection => {
                const newSelection = selection && selection.map(data => data.value);
                onChange(newSelection);
            }}
        />
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultipleSelect;
