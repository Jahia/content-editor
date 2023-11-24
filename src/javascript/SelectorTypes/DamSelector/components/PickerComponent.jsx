import {getPicker} from './utils';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../editor.proptypes';

export const PickerComponent = props => {
    const {choiceListConfig, field, inputContext, value} = props;
    if (!choiceListConfig) {
        return null;
    }

    const selectorType = getPicker(choiceListConfig, field);
    const Component = selectorType.cmp;

    return (
        <Component {...{
        ...props,
        inputContext: {
            ...inputContext,
            selectorType
        },
        value
    }}/>
    );
};

PickerComponent.propTypes = {
    field: FieldPropTypes.isRequired,
    inputContext: PropTypes.object.isRequired,
    choiceListConfig: PropTypes.array.isRequired,
    value: PropTypes.string.isRequired
};
