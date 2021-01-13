import React from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'formik';
import {FieldPropTypes} from '~/FormDefinitions';
import {resolveSelectorType} from '~/SelectorTypes';
import {Field} from './Field';
import {registry} from '@jahia/ui-extender';

const FieldContainerCmp = ({field, formik, inputContext}) => {
    const selectorType = resolveSelectorType(field);

    const setActionContext = actionContext => {
        registry.addOrReplace('selectorType.actionContext', field.name, actionContext);
    };

    return (
        <Field
            idInput={field.name}
            inputContext={{
                displayLabels: true,
                displayBadges: true,
                displayErrors: true,
                fieldComponent: selectorType.cmp,
                setActionContext: setActionContext,
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
