import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import startWorkflow from './startWorkflow/startWorkflow.action';
import unpublishAction from './unpublish/unpublish.action';
import {Edit, Save, CloudUpload, CloudOff} from '@material-ui/icons';
import {menuAction, composeActions} from '@jahia/react-material';
import {DotsVertical} from 'mdi-material-ui';
import openEngineTabs from './openEngineTabs/openEngineTabs.action';
import {withFormikAction} from '../actions/withFormik.action';
import {withPublicationInfoContextAction} from '../actions/withPublicationInfoContext.action';

export const registerActions = actionsRegistry => {
    // Content Media Manager Action
    actionsRegistry.add('contentEdit', actionsRegistry.get('router'), {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
        target: ['contentActions:2.5'],
        hideOnNodeTypes: ['jnt:virtualsite'],
        mode: 'edit'
    });

    // In app actions

    actionsRegistry.add('submitSave', saveAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.save.name',
        buttonIcon: <Save/>,
        target: ['editHeaderActions:1']
    });

    actionsRegistry.add('publishAction', publishAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.publish.name',
        buttonIcon: <CloudUpload/>,
        target: ['editHeaderActions:1']
    });

    actionsRegistry.add('startWorkflowMainButton', startWorkflow, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        target: ['editHeaderActions:1']
    });

    /* 3 dots menu */

    actionsRegistry.add('ContentEditorHeaderMenu', composeActions(withFormikAction, withPublicationInfoContextAction, menuAction), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'ContentEditorHeaderActions',
        showIcons: true
    });

    actionsRegistry.add('upload', actionsRegistry.get('fileUpload'), {
        buttonIcon: <CloudUpload/>,
        buttonLabel: 'label.contentManager.fileUpload.uploadButtonLabel',
        target: ['pickerDialogAction:0'],
        contentType: 'jnt:file',
        showOnNodeTypes: ['jnt:folder'],
        requiredPermission: 'jcr:addChildNodes'
    });

    actionsRegistry.add('startWorkflow3dots', startWorkflow, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.startWorkflow.name',
        buttonIcon: <CloudUpload/>,
        target: ['ContentEditorHeaderActions:1']
    });

    actionsRegistry.add('unpublishAction', unpublishAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.unpublish.name',
        buttonIcon: <CloudOff/>,
        target: ['ContentEditorHeaderActions:2']
    });

    actionsRegistry.add('versioningTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.versioningTab',
        target: ['ContentEditorHeaderActions:3'],
        tabs: ['versioning']
    });

    actionsRegistry.add('seoTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.seoTab',
        target: ['ContentEditorHeaderActions:4'],
        tabs: ['seo']
    });

    actionsRegistry.add('visibilityTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.visibilityTab',
        target: ['ContentEditorHeaderActions:5'],
        tabs: ['visibility']
    });

    actionsRegistry.add('historyTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.historyTab',
        target: ['ContentEditorHeaderActions:6'],
        tabs: ['history']
    });

    actionsRegistry.add('usagesTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.usagesTab',
        target: ['ContentEditorHeaderActions:7'],
        tabs: ['usages']
    });
};
