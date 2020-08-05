import React from 'react';
import {ArrowLeft} from '@jahia/moonstone';
import {registerEditActions} from '~/Edit/Edit.actions';
import {registerCreateActions} from '~/Create/Create.actions';
import {registerEditPanelActions} from '~/EditPanel/EditPanel.actions';
import goBackAction from './actions/goBack.action';

export const registerCEActions = registry => {
    registerEditActions(registry);
    registerCreateActions(registry);
    registerEditPanelActions(registry);

    registry.add('action', 'backButton', goBackAction, {
        buttonIcon: <ArrowLeft/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.goBack.name',
        targets: ['editHeaderPathActions:1'],
        showIcons: true
    });
};
