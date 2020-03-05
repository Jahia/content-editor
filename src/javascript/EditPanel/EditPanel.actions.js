import React from 'react';
import tabBarAction from './tabbar/tabbar.action';
import {Edit, Settings} from '@material-ui/icons';

export const registerEditPanelActions = actionsRegistry => {
    // Tab bar actions
    actionsRegistry.add('action', 'ceEditTab', tabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.edit',
        buttonIcon: <Edit/>,
        targets: ['editHeaderTabsActions:1'],
        value: 'edit'
    });

    actionsRegistry.add('action', 'ceAdvancedTab', tabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.advanced',
        buttonIcon: <Settings/>,
        targets: ['editHeaderTabsActions:1'],
        value: 'advanced'
    });
};
