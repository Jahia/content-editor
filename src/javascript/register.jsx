import React from 'react';
import {registry} from '@jahia/registry';
import {Edit, Save, ArrowBack, CloudUpload} from '@material-ui/icons';
import saveAction from './actions/saveAction';
import publishAction from './actions/publishAction';
import goBackAction from './actions/goBackAction';
import EditPanelConstants from './EditPanelContainer/EditPanel/EditPanelConstants';
import EditPanelContainer from './EditPanelContainer';

console.log('Load Content Editor Ext Components');

const contextJsParameters = window.contextJsParameters;
/* eslint-disable-next-line */
__webpack_public_path__ = contextJsParameters.contextPath + '/modules/content-editor/javascript/apps/';

contextJsParameters.i18nNamespaces.push('content-editor');

if (contextJsParameters && contextJsParameters.config && contextJsParameters.config.actions) {
    contextJsParameters.config.actions.push(actionsRegistry => {
        console.log('Register Content Editor actions');
        actionsRegistry.add('contentEdit', actionsRegistry.get('router'), {
            buttonIcon: <Edit/>,
            buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
            target: ['contentActions:2.5'],
            hideOnNodeTypes: ['jnt:virtualsite'],
            mode: 'edit'
        });

        actionsRegistry.add('backButton', goBackAction, {
            buttonIcon: <ArrowBack/>,
            target: ['editHeaderActions:1'],
            mode: 'browse'
        });

        actionsRegistry.add('submitSave', saveAction, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
            buttonIcon: <Save/>,
            target: ['editHeaderActions:2'],
            submitOperation: EditPanelConstants.submitOperation.SAVE
        });

        actionsRegistry.add('publishAction', publishAction, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.publish.name',
            buttonIcon: <CloudUpload/>,
            target: ['editHeaderActions:2'],
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
