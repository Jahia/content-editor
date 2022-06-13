import React from 'react';
import {tabBarAction} from './tabBarAction';
import {Edit, Setting} from '@jahia/moonstone';
import {Constants} from '~/ContentEditor.constants';
import {EditPanelContent} from './EditPanelContent';
import {AdvancedOptions} from './AdvancedOptions';

export const registerTabBarActions = actionsRegistry => {
    // Tab bar actions
    actionsRegistry.add('action', 'ceEditTab', tabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.edit',
        buttonIcon: <Edit/>,
        targets: ['editHeaderTabsActions:1'],
        value: Constants.editPanel.editTab,
        dataSelRole: 'tab-edit',
        displayableComponent: EditPanelContent,
        isDisplayable: () => true
    });

    actionsRegistry.add('action', 'ceAdvancedTab', tabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.advanced',
        buttonIcon: <Setting/>,
        targets: ['editHeaderTabsActions:2'],
        value: 'advanced',
        dataSelRole: 'tab-advanced-options',
        displayableComponent: AdvancedOptions,
        isDisplayable: props => props.mode === Constants.routes.baseEditRoute,
        requiredPermission: [Constants.permissions.canSeeAdvancedOptionsTab]
    });
};
