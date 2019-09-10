import React from 'react';
import saveAction from './save/save.action';
import publishAction from './publish/publish.action';
import unpublishAction from './unpublish/unpublish.action';
import {Edit, Save, CloudUpload, CloudOff} from '@material-ui/icons';

import EditPanelConstants from '../EditPanelContainer/EditPanel/EditPanelConstants';

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
        target: ['editHeaderActions:1'],
        submitOperation: EditPanelConstants.submitOperation.SAVE
    });

    actionsRegistry.add('publishAction', publishAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.publish.name',
        buttonIcon: <CloudUpload/>,
        target: ['editHeaderActions:1'],
        submitOperation: EditPanelConstants.submitOperation.SAVE_PUBLISH
    });

    actionsRegistry.add('unpublishAction', unpublishAction, {
        buttonLabel:
            'content-editor:label.contentEditor.edit.action.unpublish.name',
        buttonIcon: <CloudOff/>,
        target: ['editHeaderActions:1'],
        submitOperation: EditPanelConstants.submitOperation.UNPUBLISH
    });
};
