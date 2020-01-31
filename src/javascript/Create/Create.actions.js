import React from 'react';
import {Save, Queue} from '@material-ui/icons';

import createNewContentAction from './CreateNewContentAction/createNewContent.action';
import createButtonAction from './CreateForm/create.action';

export default registry => {
    registry.addOrReplace('action', 'createContent', createNewContentAction, {
        buttonIcon: <Queue/>,
        buttonLabel:
            'content-editor:label.contentEditor.CMMActions.createNewContent.menu',
        targets: ['createMenuActions:3', 'contentActions:3'],
        showOnNodeTypes: ['jnt:contentFolder', 'jnt:content']
    });

    // In app actions
    registry.add('action', 'createButton', createButtonAction, {
        buttonLabel:
            'content-editor:label.contentEditor.create.createButton.name',
        buttonIcon: <Save/>,
        targets: ['editHeaderActions:1']
    });
};
