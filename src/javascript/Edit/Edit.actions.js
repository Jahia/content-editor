import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import startWorkflow from './startWorkflow/startWorkflow.action';
import unpublishAction from './unpublish/unpublish.action';
import copyLanguageAction from './copyLanguage/copyLanguage.action';
import {Save, CloudUpload, CloudOff} from '@material-ui/icons';
import {Edit, ChevronDown} from '@jahia/moonstone/dist/icons';
import openEngineTabs from './engineTabs/openEngineTabs.action';
import editContentAction from './EditContent.action';

export const registerEditActions = actionsRegistry => {
    actionsRegistry.add('action', 'edit', editContentAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        targets: ['contentActions:2'],
        hideOnNodeTypes: ['jnt:virtualsite']
    });

    // In app actions

    actionsRegistry.add('action', 'submitSave', saveAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
        buttonIcon: <Save/>,
        color: 'accent',
        variant: 'outlined',
        targets: ['editHeaderActions:1'],
        dataSelRole: 'submitSave'
    });

    actionsRegistry.add('action', 'publishAction', publishAction, {
        buttonIcon: <CloudUpload/>,
        color: 'accent',
        targets: ['editHeaderActions:1'],
        dataSelRole: 'publishAction'
    });

    actionsRegistry.add('action', 'startWorkflowMainButton', startWorkflow, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        targets: ['editHeaderActions:1'],
        dataSelRole: 'startWorkflowMainButton'
    });

    /* 3 dots menu */
    actionsRegistry.add('action', 'ContentEditorHeaderMenu', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <ChevronDown/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.moreOptions',
        menuTarget: 'ContentEditorHeaderActions'
    });

    actionsRegistry.add('action', 'startWorkflow3dots', startWorkflow, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        targets: ['ContentEditorHeaderActions:1']
    });

    actionsRegistry.add('action', 'unpublishAction', unpublishAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.unpublish.name',
        buttonIcon: <CloudOff/>,
        targets: ['ContentEditorHeaderActions:2']
    });

    // SINCE DX 7.5 this fct is introduce, not usable by previous DX version
    if (window.authoringApi && !window.authoringApi.getEditTabs) {
        actionsRegistry.add('action', 'versioningTabAction', openEngineTabs, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.versioningTab',
            targets: ['ContentEditorHeaderActions:3'],
            tabs: ['versioning']
        });

        actionsRegistry.add('action', 'seoTabAction', openEngineTabs, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.seoTab',
            targets: ['ContentEditorHeaderActions:4'],
            tabs: ['seo']
        });

        actionsRegistry.add('action', 'visibilityTabAction', openEngineTabs, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.visibilityTab',
            targets: ['ContentEditorHeaderActions:5'],
            tabs: ['visibility']
        });

        actionsRegistry.add('action', 'historyTabAction', openEngineTabs, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.historyTab',
            targets: ['ContentEditorHeaderActions:6'],
            tabs: ['history']
        });

        actionsRegistry.add('action', 'usagesTabAction', openEngineTabs, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.usagesTab',
            targets: ['ContentEditorHeaderActions:7'],
            tabs: ['usages']
        });
    }

    actionsRegistry.add('action', 'copyLanguageAction', copyLanguageAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.copyLanguage.name',
        targets: ['ContentEditorHeaderActions:8']
    });
};
