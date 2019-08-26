import React from 'react';
import {registry} from '@jahia/registry';
import {Edit, Save, ArrowBack, CloudUpload, CloudOff} from '@material-ui/icons';
import saveAction from './actions/saveAction';
import publishAction from './actions/publishAction';
import unpublishAction from './actions/unpublishAction';
import goBackAction from './actions/goBackAction';
import createNewContentAction from './actions/CreateNewContent/createNewContent.action';
import EditPanelConstants from './EditPanelContainer/EditPanel/EditPanelConstants';
import ContentEditor from './ContentEditor';
import {SelectorTypes} from './EditPanelContainer/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes';

console.log('Content Editor is activated');

const contextJsParameters = window.contextJsParameters;
/* eslint-disable-next-line */
__webpack_public_path__ =
    contextJsParameters.contextPath +
    '/modules/content-editor/javascript/apps/';

contextJsParameters.i18nNamespaces.push('content-editor');

if (
    contextJsParameters &&
    contextJsParameters.config &&
    contextJsParameters.config.actions
) {
    contextJsParameters.config.actions.push(actionsRegistry => {
        // Content Media Manager Action
        actionsRegistry.add('contentEdit', actionsRegistry.get('router'), {
            buttonIcon: <Edit/>,
            buttonLabel: 'content-editor:label.contentEditor.edit.contentEdit',
            target: ['contentActions:2.5'],
            hideOnNodeTypes: ['jnt:virtualsite'],
            mode: 'edit'
        });

        actionsRegistry.add('createNewContent', createNewContentAction, {
            buttonIcon: <Edit/>,
            buttonLabel:
                'content-editor:label.contentEditor.CMMActions.createNewContent.label',
            target: ['createMenuActions:3.2', 'contentActions:3.2'],
            showOnNodeTypes: ['jnt:content']
        });

        // In app actions

        actionsRegistry.add('backButton', goBackAction, {
            buttonIcon: <ArrowBack/>,
            buttonLabel:
                'content-editor:label.contentEditor.edit.action.goBack.name',
            target: ['editHeaderPathActions:1']
        });

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

        // SelectorType actions
        const selectorTypes = Object.values(SelectorTypes);
        selectorTypes.forEach(selectorType => {
            if (selectorType.actions) {
                selectorType.actions(actionsRegistry);
            }
        });
    });
}

registry.add('edit-route', {
    target: ['cmm:0.1'],
    type: 'route',
    path: `/:siteKey/:lang/${EditPanelConstants.baseRoute}`,
    render: () => <ContentEditor/>
});
