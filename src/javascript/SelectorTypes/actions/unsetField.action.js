import React from 'react';
import PropTypes from 'prop-types';

export const UnsetFieldActionComponent = ({field, formik, inputContext, render: Render, loading: Loading, ...others}) => {
    const value = formik.values[field.name];
    const enabled = Boolean(!field.readOnly && (
        Array.isArray(value) ? value && value.length !== 0 : value
    ));

    return (
        <Render
            {...others}
            enabled={enabled}
            onClick={() => {
                formik.setFieldValue(
                    field.name,
                    null,
                    true
                );
                formik.setFieldTouched(field.name);
                if (inputContext.actionContext.onChange) {
                    inputContext.actionContext.onChange(null);
                }
            }}
        />
    );
};

UnsetFieldActionComponent.propTypes = {
    field: PropTypes.object.isRequired,

    formik: PropTypes.object.isRequired,

    inputContext: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};

