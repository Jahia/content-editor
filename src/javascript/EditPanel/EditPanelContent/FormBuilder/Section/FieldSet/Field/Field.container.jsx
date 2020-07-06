import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {connect} from 'formik';

import {FieldPropTypes} from '~/FormDefinitions';
import {resolveSelectorType} from '~/SelectorTypes';
import {Field} from './Field';

const FieldContainerCmp = ({field, formik, inputContext}) => {
    const selectorType = resolveSelectorType(field);
    const [actionContext, _setActionContext] = useState({noAction: true});
    if (!selectorType) {
        if (field.selectorType) {
            console.warn(`No renderer component for ${field.selectorType} selectorType`);
        } else {
            console.error(`Field ${field.displayName} has no selectorType !`, field);
        }

        return <></>;
    }

    const setActionContext = getNewActionContext => {
        const newActionContext = getNewActionContext(actionContext);
        if (newActionContext.contextHasChange) {
            _setActionContext({field, formik, ...newActionContext});
        }
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
            formik={formik}
            actionContext={actionContext}/>
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
