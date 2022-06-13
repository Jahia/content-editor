import React from 'react';
import PropTypes from 'prop-types';
import {Constants} from '~/ContentEditor.constants';

export const OpenInTabActionComponent = ({field, render: Render, loading: Loading, inputContext, ...others}) => {
    const {fieldData, editorContext} = inputContext.actionContext;
    return (
        <Render
            {...others}
            onClick={() => {
                window.open(`${window.contextJsParameters.urlbase}/${Constants.appName}/${editorContext.lang}/${Constants.routes.baseEditRoute}/${fieldData.uuid}`, '_blank');
            }}
        />
    );
};

OpenInTabActionComponent.propTypes = {
    field: PropTypes.object.isRequired,

    inputContext: PropTypes.object.isRequired,

    render: PropTypes.func.isRequired,

    loading: PropTypes.func
};

export const openInTabAction = {
    component: OpenInTabActionComponent
};
