import React from 'react';
import PropTypes from 'prop-types';

export const ReplaceActionComponent = ({field, inputContext, render: Render, loading: Loading, ...others}) => {
    return (
        <Render
            {...others}
            enabled={!field.readOnly}
            onClick={() => {
                inputContext.actionContext.open(true);
            }}
        />
    );
};

ReplaceActionComponent.propTypes = {
    field: PropTypes.object.isRequired,

    inputContext: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};

export const replaceAction = {
    component: ReplaceActionComponent
};
