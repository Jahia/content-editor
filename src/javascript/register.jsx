import React from 'react';
import {registry} from '@jahia/registry';
import {Edit, Save, ArrowBack} from '@material-ui/icons';
import submitAction from './actions/submitAction';
import goBackAction from './actions/goBackAction';
import EditPanelConstants from './EditPanelContainer/EditPanel/EditPanelConstants';
import EditPanelContainer from './EditPanelContainer';

console.log('Load Content Editor Ext Components');
/* eslint-disable */
__webpack_public_path__ = window.contextJsParameters.contextPath + '/modules/content-editor/javascript/apps/';
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

        actionsRegistry.add('backButton', goBackAction, {
            buttonIcon: <ArrowBack/>,
            target: ['editHeaderActions:1'],
            mode: 'browse'
        });

        actionsRegistry.add('submitSave', submitAction, {
            buttonLabel: 'content-editor:label.contentEditor.edit.action.save.name',
            buttonIcon: <Save/>,
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

// Prevent close browser's tab when there is unsaved content
window.addEventListener('beforeunload', ev => {
    if (window.FORMIK_IS_DIRTY) {
        ev.preventDefault();
        ev.returnValue = '';
    }
});
