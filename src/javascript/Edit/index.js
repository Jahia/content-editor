import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import unpublishAction from './unpublish/unpublish.action';
import {Edit, Save, CloudUpload, CloudOff} from '@material-ui/icons';
import {menuAction} from '@jahia/react-material';
import {DotsVertical} from 'mdi-material-ui';
import openEngineTabs from './openEngineTabs/openEngineTabs.action';

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

    actionsRegistry.add('ContentEditorHeaderMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'ContentEditorHeaderActions',
        showIcons: true
    });

    actionsRegistry.add('unpublishAction', unpublishAction, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.unpublish.name',
        buttonIcon: <CloudOff/>,
        target: ['ContentEditorHeaderActions:1']
    });

    actionsRegistry.add('versioningTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.versioningTab',
        target: ['ContentEditorHeaderActions:2'],
        tabs: ['versioning']
    });

    actionsRegistry.add('seoTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.seoTab',
        target: ['ContentEditorHeaderActions:3'],
        tabs: ['seo']
    });

    actionsRegistry.add('visibilityTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.visibilityTab',
        target: ['ContentEditorHeaderActions:4'],
        tabs: ['visibility']
    });

    actionsRegistry.add('historyTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.historyTab',
        target: ['ContentEditorHeaderActions:5'],
        tabs: ['history']
    });

    actionsRegistry.add('usagesTabAction', openEngineTabs, {
        buttonLabel: 'content-editor:label.contentEditor.edit.action.usagesTab',
        target: ['ContentEditorHeaderActions:6'],
        tabs: ['usages']
    });
};
