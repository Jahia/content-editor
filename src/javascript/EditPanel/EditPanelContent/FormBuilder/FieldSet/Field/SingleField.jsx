import React from 'react';
import * as PropTypes from 'prop-types';
import {Field, useFormikContext} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

// Todo Try to use FastField here -> fixed dependant fields

export const SingleFieldCmp = ({inputContext, editorContext, field, onChange}) => {
    const FieldComponent = inputContext.fieldComponent;
    const formik = useFormikContext();
    return (
        <Field component={FieldComponent}
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
