import React from 'react';
import {Save} from '@material-ui/icons';
import {AddCircle} from '@jahia/moonstone/dist/icons';

import createNewContentAction from './CreateNewContentAction/createNewContent.action';
import createButtonAction from './CreateForm/create.action';

export const registerCreateActions = registry => {
    registry.addOrReplace('action', 'createContent', createNewContentAction, {
        buttonIcon: <AddCircle/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.menu',
        targets: ['createMenuActions:3', 'contentActions:3', 'headerPrimaryActions:1'],
        showOnNodeTypes: ['jnt:contentFolder', 'jnt:content'],
        requiredPermission: ['jcr:addChildNodes']
    });

    // In app actions
    registry.add('action', 'createButton', createButtonAction, {
        buttonLabel: 'content-editor:label.contentEditor.create.createButton.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['content-editor/header/main-actions'],
        dataSelRole: 'createButton'
    });
};
