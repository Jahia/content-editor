import React from 'react';
import TabBarAction from './tabbar/tabbar.action';
import {Edit, Setting} from '@jahia/moonstone';
import {Constants} from '~/ContentEditor.constants';
import EditPanelContent from '~/EditPanel/EditPanelContent/EditPanelContent';
import AdvancedOptions from '~/EditPanel/AdvancedOptions/AdvancedOptions';

export const registerEditPanelActions = actionsRegistry => {
    // Tab bar actions
    actionsRegistry.add('action', 'ceEditTab', TabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.edit',
        buttonIcon: <Edit/>,
        targets: ['editHeaderTabsActions:1'],
        value: Constants.editPanel.editTab,
        dataSelRole: 'tab-edit',
        displayableComponent: EditPanelContent,
        isDisplayable: () => true
    });

    actionsRegistry.add('action', 'ceAdvancedTab', TabBarAction, {
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
