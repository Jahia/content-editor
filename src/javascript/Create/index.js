import React from 'react';
import {Save, Queue} from '@material-ui/icons';

import createNewContentAction from './CreateNewContentAction/createNewContent.action';
import createButtonAction from './CreateForm/create.action';

export const registerActions = actionsRegistry => {
    // Content Media Manager Action
    if (actionsRegistry.registry && actionsRegistry.registry.createContent) {
        delete actionsRegistry.registry.createContent;
    }

    actionsRegistry.add('createNewContent', createNewContentAction, {
        buttonIcon: <Queue/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.menu',
        target: ['createMenuActions:3', 'contentActions:3'],
        showOnNodeTypes: ['jnt:contentFolder', 'jnt:content']
    });

    // In app actions
    actionsRegistry.add('createButton', createButtonAction, {
        buttonLabel:
            'content-editor:label.contentEditor.create.createButton.name',
        buttonIcon: <Save/>,
        target: ['editHeaderActions:1']
    });
};
