import React from 'react';
import * as PropTypes from 'prop-types';
import {FastField, useFormikContext} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, editorContext, field, onChange}) => {
    const FieldComponent = inputContext.fieldComponent;
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
        />
    );
};

SingleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleField = SingleFieldCmp;

SingleField.displayName = 'SingleField';
