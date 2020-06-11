import {MultipleInput} from '~/DesignSystem/MultipleInput';
import {FastField} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const MultipleSelect = ({field, id, setActionContext, onChange}) => {
    return (
        <FastField
            name={field.name}
            render={props => {
                const {value} = props.field;
                // eslint-disable-next-line react/prop-types
                const {setFieldValue, setFieldTouched} = props.form;

                const options = field.valueConstraints.map(constraint => ({
                    label: constraint.displayValue,
                    value: constraint.value.string
                }));

                const multipleSelectOnChange = newValues => {
                    let previousValue = [];
                    let currentValue = [];
                    field.valueConstraints.forEach(item => {
                        if (value?.includes(item.value.string)) {
                            previousValue.push(item);
                        }

                        if (newValues?.includes(item.value.string)) {
                            currentValue.push(item);
                        }
                    });
                    onChange(previousValue, currentValue);
                };

                setActionContext(prevActionContext => ({
                    initialized: true,
                    contextHasChange: !prevActionContext.initialized ||
                        // As action system make deep copy of formik each time value change we must update the context !
                        prevActionContext.formik.values[field.name] !== value,
                    onChange: multipleSelectOnChange
                }));

                return (
                    <MultipleInput
                        id={id}
                        options={options}
                        value={value && options.filter(data => value.includes(data.value))}
                        readOnly={field.readOnly}
                        onChange={selection => {
                            const newSelection = selection && selection.map(data => data.value);
                            setFieldValue(field.name, newSelection, true);
                            setFieldTouched(field.name, [true]);
                            multipleSelectOnChange(newSelection);
                        }}
                    />
                );
            }}
        />
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    setActionContext: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MultipleSelect;
