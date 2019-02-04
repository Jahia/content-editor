import React from 'react';
import {registry} from '@jahia/registry';
import {Edit, Save} from '@material-ui/icons';
import submitAction from './EditPanelContainer/EditPanel/actions/submitAction';
import EditPanelConstants from './EditPanelContainer/EditPanel/EditPanelConstants';
import EditPanelContainer from './EditPanelContainer';

console.log('Load Content Editor Ext Components');
contextJsParameters.i18nNamespaces.push('content-editor');
if (contextJsParameters && contextJsParameters.config && contextJsParameters.config.actions) {
    contextJsParameters.config.actions.push(actionsRegistry => {
        console.log('Register Content Editor actions');
        actionsRegistry.add('contentEdit', actionsRegistry.get('router'), {
            buttonIcon: <Edit/>,
            buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
            target: ['contentActions:2.5'],
            showOnNodeTypes: ['qant:allFields'],
            mode: 'edit'
        });
        actionsRegistry.add('submitSave', submitAction, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
            buttonIcon: <Save/>,
            target: ['editHeaderActions:1'],
            submitOperation: EditPanelConstants.submitOperation.SAVE
        });
    });
}

registry.add('edit-route', {
    target: ['cmm:0.1'],
    type: 'route',
    path: '/:siteKey/:lang/edit',
    render: () => (
        <EditPanelContainer/>
    )
});
