import React from 'react';
import {registry} from '@jahia/registry';
import {ArrowBack} from '@material-ui/icons';

import goBackAction from './actions/goBack.action';
import EditPanelConstants from './EditPanelContainer/EditPanel/EditPanelConstants';
import ContentEditor from './ContentEditor';
import {SelectorTypes} from './EditPanelContainer/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes';
import {registerActions as registerEditActions} from '~Edit';
import {registerActions as registerCreateActions} from '~Create';

console.log('%c Content Editor is activated', 'color: #3c8cba');

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
        // Register actions from domains
        registerEditActions(actionsRegistry);
        registerCreateActions(actionsRegistry);

        actionsRegistry.add('backButton', goBackAction, {
            buttonIcon: <ArrowBack/>,
            buttonLabel:
                'content-editor:label.contentEditor.edit.action.goBack.name',
            target: ['editHeaderPathActions:1']
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
    path: `/:siteKey/:lang/${EditPanelConstants.baseEditRoute}`,
    render: () => <ContentEditor mode="edit"/>
});

registry.add('create-route', {
    target: ['cmm:0.1'],
    type: 'route',
    path: `/:siteKey/:lang/${EditPanelConstants.baseCreateRoute}`,
    render: () => <ContentEditor mode="create"/>
});
