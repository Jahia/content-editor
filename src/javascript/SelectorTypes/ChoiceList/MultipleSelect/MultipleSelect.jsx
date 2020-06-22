import React, {useEffect} from 'react';
import {MultipleInput} from '~/DesignSystem/MultipleInput';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const MultipleSelect = ({field, id, value, setActionContext, onChange, onInit}) => {
    const findValues = value => field.valueConstraints.filter(item => value?.includes(item.value.string));

    const multipleSelectOnChange = newValues => {
        onChange(newValues, findValues);
    };

    useEffect(() => {
        onInit(findValues(value));
    }, []);

    useEffect(() => {
        setActionContext(prevActionContext => ({
            initialized: true,
            contextHasChange: !prevActionContext.initialized ||
                // As action system make deep copy of formik each time value change we must update the context !
                prevActionContext.formik.values[field.name] !== value,
            onChange: multipleSelectOnChange
        }));
    }, [value]);

    const options = field.valueConstraints.map(constraint => ({
        label: constraint.displayValue,
        value: constraint.value.string
    }));

    return (
        <MultipleInput
            id={id}
            options={options}
            value={value && options.filter(data => value.includes(data.value))}
            readOnly={field.readOnly}
            onChange={selection => {
                const newSelection = selection && selection.map(data => data.value);
                multipleSelectOnChange(newSelection);
            }}
        />
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.arrayOf(PropTypes.string),
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired
};

export default MultipleSelect;
