import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import startWorkflow from './startWorkflow/startWorkflow.action';
import unpublishAction from './unpublish/unpublish.action';
import {Edit, Save, CloudUpload, CloudOff} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';
import openEngineTabs from './engineTabs/openEngineTabs.action';

export default actionsRegistry => {
    actionsRegistry.addOrReplace('action', 'edit', actionsRegistry.get('action', 'router'), {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        targets: ['contentActions:2'],
        hideOnNodeTypes: ['jnt:virtualsite'],
        mode: 'edit'
    });

    // In app actions

    actionsRegistry.add('action', 'submitSave', saveAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.save.name',
        buttonIcon: <Save/>,
        targets: ['editHeaderActions:1']
    });

    actionsRegistry.add('action', 'publishAction', publishAction, {
        buttonIcon: <CloudUpload/>,
        targets: ['editHeaderActions:1']
    });

    actionsRegistry.add('action', 'startWorkflowMainButton', startWorkflow, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        targets: ['editHeaderActions:1']
    });

    /* 3 dots menu */

    actionsRegistry.add('action', 'ContentEditorHeaderMenu', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.moreOptions',
        menuTarget: 'ContentEditorHeaderActions',
        showIcons: true
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
};
