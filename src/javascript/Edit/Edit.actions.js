import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import startWorkflow from './startWorkflow/startWorkflow.action';
import copyLanguageAction from './copyLanguage/copyLanguage.action';
import {Save, CloudUpload} from '@material-ui/icons';
import {Edit, MoreVert} from '@jahia/moonstone/dist/icons';
import editContentAction from './EditContent.action';
import OpenWorkInProgressModalAction from '~/EditPanel/WorkInProgress/OpenWorkInProgressModal.action';

export const registerEditActions = actionsRegistry => {
    // Edit action button in JContent
    actionsRegistry.add('action', 'edit', editContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        targets: ['contentActions:2'],
        hideOnNodeTypes: ['jnt:virtualsite'],
        requiredPermission: ['jcr:modifyProperties'],
        getDisplayName: true
    });

    // Content-EditorAction
    // Main actions (publish, save and startWorkflow)
    actionsRegistry.add('action', 'submitSave', saveAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['content-editor/header/main-actions'],
        dataSelRole: 'submitSave'
    });

    actionsRegistry.add('action', 'publishAction', publishAction, {
        buttonIcon: <CloudUpload/>,
        color: 'accent',
        targets: ['content-editor/header/main-actions:1'],
        dataSelRole: 'publishAction'
    });

    actionsRegistry.add('action', 'startWorkflowMainButton', startWorkflow, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        targets: ['content-editor/header/main-actions:1'],
        dataSelRole: 'startWorkflowMainButton'
    });

    /* 3 dots menu actions (next to tabs) */
    actionsRegistry.add('action', 'content-editor/header/3dots', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.moreOptions',
        menuTarget: 'content-editor/header/3dots',
        dataSelRole: '3dotsMenuAction'
    });

    actionsRegistry.add('action', 'goToWorkInProgress', OpenWorkInProgressModalAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.workInProgress.label',
        targets: ['content-editor/header/3dots:1'],
        dataSelRole: 'workInProgressAction'
    });

    actionsRegistry.add('action', 'copyLanguageAction', copyLanguageAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.copyLanguage.name',
        targets: ['content-editor/header/3dots:2']
    });
};
