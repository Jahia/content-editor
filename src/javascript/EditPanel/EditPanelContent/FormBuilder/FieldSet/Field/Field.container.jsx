import React from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';
import {resolveSelectorType} from '~/SelectorTypes';
import {Field} from './Field';

const FieldContainerCmp = ({field, formik, inputContext}) => {
    const selectorType = resolveSelectorType(field);

    return (
        <Field
            idInput={field.name}
            inputContext={{
                displayLabels: true,
                displayBadges: true,
                displayActions: true,
                displayErrors: true,
                fieldComponent: selectorType.cmp,
                ...inputContext
            }}
            selectorType={selectorType}
            field={field}
            formik={formik}/>
    );
};

FieldContainerCmp.defaultProps = {
    inputContext: {}
};

FieldContainerCmp.propTypes = {
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    inputContext: PropTypes.object
};

export const FieldContainer = connect(FieldContainerCmp);
FieldContainer.displayName = 'FieldContainer';
