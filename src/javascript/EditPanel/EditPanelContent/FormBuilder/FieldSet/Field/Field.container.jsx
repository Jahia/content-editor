import React from 'react';
import * as PropTypes from 'prop-types';
import {FieldPropTypes} from '~/FormDefinitions';
import {resolveSelectorType} from '~/SelectorTypes';
import {Field} from './Field';

export const FieldContainer = React.memo(({field, inputContext}) => {
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
});

FieldContainer.defaultProps = {
    inputContext: {}
};

FieldContainer.propTypes = {
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object
};

FieldContainer.displayName = 'FieldContainer';
