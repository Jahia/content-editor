import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect, FastField} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, editorContext, field, formik, onChange}) => {
    const FieldComponent = inputContext.fieldComponent;

    return (
        <FastField shouldUpdate={() => true}>
            {() => {
                return (
                    <FieldComponent field={field}
                                    id={field.name}
                                    value={formik.values[field.name]}
                                    values={formik.values}
                                    editorContext={editorContext}
                                    inputContext={inputContext}
                                    onChange={onChange}
                    />
                );
            }}
        </FastField>
    );
};

SingleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    editorContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleField = compose(
    connect
)(SingleFieldCmp);

SingleField.displayName = 'SingleField';
