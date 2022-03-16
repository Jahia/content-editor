import React from 'react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions';
import {resolveSelectorType} from '~/SelectorTypes';
import {Field} from './Field';

const FieldContainerCmp = ({field, inputContext}) => {
    const selectorType = resolveSelectorType(field);
    let context = React.useMemo(() => ({
        displayLabels: true,
        displayBadges: true,
        displayActions: true,
        displayErrors: true,
        fieldComponent: selectorType.cmp,
        ...inputContext
    }), [inputContext, selectorType.cmp]);

    return (
        <Field
            idInput={field.name}
            inputContext={context}
            selectorType={selectorType}
            field={field}/>
    );
};

FieldContainerCmp.defaultProps = {
    inputContext: {}
};

FieldContainerCmp.propTypes = {
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object
};

export const FieldContainer = FieldContainerCmp;
FieldContainer.displayName = 'FieldContainer';
