import React, {useContext, useState} from 'react';
import * as PropTypes from 'prop-types';
import {DxContext} from '@jahia/react-material';
import {connect} from 'formik';

import {FieldPropTypes} from '../../../../../../FormDefinitions';
import {resolveSelectorType} from './SelectorTypes/SelectorTypes.utils';
import {ContentEditorContext} from '../../../../../../../ContentEditor.context';
import {Field} from './Field';

const FieldContainerCmp = ({field, formik}) => {
    const selectorType = resolveSelectorType(field);
    const dxContext = useContext(DxContext);
    const [actionContext, _setActionContext] = useState({noAction: true});
    const editorContext = useContext(ContentEditorContext);

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
            _setActionContext({field, formik, dxContext, ...newActionContext});
        }
    };

    return (
        <Field
            idInput={field.name}
            inputContext={{
                fieldComponent: selectorType.cmp,
                editorContext: editorContext,
                setActionContext: setActionContext
            }}
            selectorType={selectorType}
            siteInfo={editorContext.siteInfo}
            field={field}
            formik={formik}
            actionContext={actionContext}/>
    );
};

FieldContainerCmp.propTypes = {
    field: FieldPropTypes.isRequired,
    formik: PropTypes.object.isRequired
};

export const FieldContainer = connect(FieldContainerCmp);
FieldContainer.displayName = 'FieldContainer';
