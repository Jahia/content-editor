import React from 'react';
import {ArrowBack} from '@material-ui/icons';
import {SelectorTypes} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes';
import {registerActions as registerEditActions} from '~/Edit';
import {registerActions as registerCreateActions} from '~/Create';
import goBackAction from './actions/goBack.action';

export const registerCEActions = () => {
    const contextJsParameters = window.contextJsParameters;

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
                buttonLabel: 'content-editor:label.contentEditor.edit.action.goBack.name',
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
};
