import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, field, onChange, formik}) => {
    const FieldComponent = inputContext.fieldComponent;

    return (
        <FieldComponent field={field}
                        id={field.name}
                        value={formik.values[field.name]}
                        editorContext={inputContext.editorContext}
                        setActionContext={inputContext.setActionContext}
                        onChange={onChange}
        />
    );
};

SingleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};

export const SingleField = compose(
    connect
)(SingleFieldCmp);

SingleField.displayName = 'SingleField';
