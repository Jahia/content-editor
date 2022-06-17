import React from 'react';
import * as PropTypes from 'prop-types';
import {FastField, useFormikContext} from 'formik';
import {FieldPropTypes} from '~/ContentEditor.proptypes';

export const SingleField = ({inputContext, editorContext, field, onChange, onBlur}) => {
    const FieldComponent = inputContext.selectorType.cmp;
    const formik = useFormikContext();
    return (
        <FastField
            shouldUpdate={(nextProps, props) => {
                return nextProps.value !== props.value || nextProps.field !== props.field;
            }}
            component={FieldComponent}
            id={field.name}
            name={field.name}
            value={formik.values[field.name]}
            field={field}
            editorContext={editorContext}
            inputContext={inputContext}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

SingleField.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};

