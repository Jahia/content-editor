import React from 'react';
import PropTypes from 'prop-types';

export const SelectAllActionComponent = ({field, formik, inputContext, render: Render, loading: Loading, ...others}) => {
    if (!field.multiple || field.readOnly || !field.valueConstraints || field.valueConstraints.length === 0) {
        return false;
    }

    const values = formik.values[field.name] || [];
    const possibleValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
    const enabled = !possibleValues.every(i => values.includes(i));

    return (
        <Render
            {...others}
            enabled={enabled}
            onClick={() => {
                if (!enabled) {
                    return;
                }

                const possibleValues = field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
                formik.setFieldValue(
                    field.name,
                    possibleValues,
                    true
                );
                formik.setFieldTouched(field.name, [true]);
                if (inputContext.actionContext.onChange) {
                    inputContext.actionContext.onChange(possibleValues);
                }
            }}
        />
    );
};

SelectAllActionComponent.propTypes = {
    field: PropTypes.object.isRequired,

    formik: PropTypes.object.isRequired,

    inputContext: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};