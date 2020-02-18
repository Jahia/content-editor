import React from 'react';
import * as PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';

export const SingleFieldCmp = ({inputContext, field, formik}) => {
    const FieldComponent = inputContext.fieldComponent;

    return (
        <FieldComponent field={field}
                        id={field.name}
                        value={formik.values[field.name]}
                        editorContext={inputContext.editorContext}
                        setActionContext={inputContext.setActionContext}/>
    );
};

SingleFieldCmp.propTypes = {
    inputContext: PropTypes.object.isRequired,
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

export const SingleField = compose(
    connect
)(SingleFieldCmp);

SingleField.displayName = 'SingleField';
