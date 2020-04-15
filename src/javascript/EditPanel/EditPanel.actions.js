import React from 'react';
import TabBarAction from './tabbar/tabbar.action';
import {Edit, Settings} from '@material-ui/icons';
import {Constants} from '~/ContentEditor.constants';
import EditPanelContent from '~/EditPanel/EditPanelContent/EditPanelContent';
import AdvancedOptions from '~/EditPanel/AdvancedOptions/AdvancedOptions';

export const registerEditPanelActions = actionsRegistry => {
    // Tab bar actions
    actionsRegistry.add('action', 'ceEditTab', TabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.edit',
        buttonIcon: <Edit/>,
        targets: ['editHeaderTabsActions:1'],
        value: 'edit',
        dataSelRole: 'tab-edit',
        displayableComponent: EditPanelContent,
        isDisplayable: () => true
    });

    actionsRegistry.add('action', 'ceAdvancedTab', TabBarAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.tab.advanced',
        buttonIcon: <Settings/>,
        targets: ['editHeaderTabsActions:2'],
        value: 'advanced',
        dataSelRole: 'tab-advanced-options',
        displayableComponent: AdvancedOptions,
        isDisplayable: context => context.mode === Constants.routes.baseEditRoute
    });
};
