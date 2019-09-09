import React from 'react';
import {Edit} from '@material-ui/icons';

import createNewContentAction from './CreateNewContentAction/createNewContent.action';

export const registerActions = actionsRegistry => {
    // Content Media Manager Action
    actionsRegistry.add('createNewContent', createNewContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.label',
        target: ['createMenuActions:3.2', 'contentActions:3.2']
    });

    // In app actions
};
