import React from 'react';
import TabBarAction from './tabbar/tabbar.action';
import {Edit, Settings} from '@material-ui/icons';

export const registerEditPanelActions = actionsRegistry => {
    // Tab bar actions
    actionsRegistry.add('action', 'ceEditTab', TabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.edit',
        buttonIcon: <Edit/>,
        targets: ['editHeaderTabsActions:1'],
        value: 'edit',
        dataSelRole: 'tab-edit'
    });

    actionsRegistry.add('action', 'ceAdvancedTab', TabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.advanced',
        buttonIcon: <Settings/>,
        targets: ['editHeaderTabsActions:1'],
        value: 'advanced',
        dataSelRole: 'tab-advanced-options'
    });
};
