import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import startWorkflow from './startWorkflow/startWorkflow.action';
import {CloudUpload, Save} from '@material-ui/icons';
import {Edit, MoreVert} from '@jahia/moonstone';
import editContentAction from './EditContent.action';
import OpenWorkInProgressModalAction from '~/EditPanel/WorkInProgress/OpenWorkInProgressModal.action';
import {CopyLanguageActionComponent} from '~/Edit/copyLanguage/copyLanguage.action';

export const registerEditActions = actionsRegistry => {
    // Edit action button in JContent; need separate actions for content and pages
    actionsRegistry.add('action', 'edit', editContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        targets: ['contentActions:2'],
        hideOnNodeTypes: ['jnt:virtualsite', 'jnt:page'], // For edit content
        requiredSitePermission: ['editAction'],
        getDisplayName: true
    });

    // Edit action button in JContent; need separate actions for content and pages
    actionsRegistry.add('action', 'editPage', editContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        targets: ['contentActions:2'],
        showOnNodeTypes: ['jnt:page'], // For edit pages
        requiredSitePermission: ['editPageAction'],
        getDisplayName: true
    });

    // Edit action button in JContent
    actionsRegistry.add('action', 'quickEdit', editContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        hideOnNodeTypes: ['jnt:virtualsite'],
        getDisplayName: true,
        isModal: true,
        isFullscreen: false
    });

    // Content-EditorAction
    // Main actions (publish, save and startWorkflow)
    actionsRegistry.add('action', 'submitSave', saveAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['content-editor/header/main-save-actions'],
        dataSelRole: 'submitSave'
    });

    actionsRegistry.add('action', 'publishAction', publishAction, {
        buttonIcon: <CloudUpload/>,
        color: 'accent',
        targets: ['content-editor/header/main-publish-actions:1'],
        dataSelRole: 'publishAction'
    });

    actionsRegistry.add('action', 'startWorkflowMainButton', startWorkflow, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        targets: ['content-editor/header/main-publish-actions:1'],
        dataSelRole: 'startWorkflowMainButton'
    });

    /* 3 dots menu actions (next to tabs) */
    actionsRegistry.add('action', 'content-editor/header/3dots', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.moreOptions',
        menuTarget: 'content-editor/header/3dots',
        dataSelRole: '3dotsMenuAction'
    });

    /* 3 dots menu actions (for each field) */
    actionsRegistry.add('action', 'content-editor/field/3dots', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.moreOptions',
        menuTarget: 'content-editor/field/3dots',
        dataSelRole: '3dotsMenuAction',
        isMenuPreload: true
    });

    actionsRegistry.add('action', 'goToWorkInProgress', OpenWorkInProgressModalAction, {
        targets: ['content-editor/header/3dots:1'],
        dataSelRole: 'workInProgressAction'
    });

    actionsRegistry.add('action', 'copyLanguageAction', {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.copyLanguage.name',
        targets: ['content-editor/header/3dots:2'],
        component: CopyLanguageActionComponent
    });
};

