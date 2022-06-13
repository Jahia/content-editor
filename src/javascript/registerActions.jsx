import React from 'react';
import {ArrowLeft} from '@jahia/moonstone';
import {registerEditActions} from '~/actions/registerEditActions';
import {registerCreateActions} from '~/actions/registerCreateActions';
import {registerTabBarActions} from '~/editorTabs/registerTabBarActions';
import {goBackAction} from './actions/contenteditor/goBackAction';

export const registerActions = registry => {
    registerEditActions(registry);
    registerCreateActions(registry);
    registerTabBarActions(registry);

    registry.add('action', 'backButton', goBackAction, {
        buttonIcon: <ArrowLeft/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.goBack.name',
        targets: ['editHeaderPathActions:1'],
        showIcons: true
    });
};
