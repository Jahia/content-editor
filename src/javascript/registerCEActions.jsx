import React from 'react';
import {ArrowLeft} from '@jahia/moonstone';
import {registerEditActions} from '~/actions/Edit.actions';
import {registerCreateActions} from '~/actions/Create.actions';
import {registerEditPanelActions} from '~/EditPanel/EditPanel.actions';
import goBackAction from './actions/contenteditor/goBackAction';

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
