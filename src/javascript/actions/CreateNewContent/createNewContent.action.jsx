import React from 'react';
import {CreateNewContentDialog} from './CreateNewContentDialog';
import {composeActions, componentRendererAction} from '@jahia/react-material';

export default composeActions(componentRendererAction, {
    onClick: context => {
        context.renderComponent(<CreateNewContentDialog/>);
    }
});
