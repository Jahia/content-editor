import React from 'react';
import {ArrowBack} from '@material-ui/icons';
import {SelectorTypes} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes';
import {registerEditActions} from '~/Edit/Edit.actions';
import {registerCreateActions} from '~/Create/Create.actions';
import goBackAction from './actions/goBack.action';

export const registerCEActions = registry => {
    registerEditActions(registry);
    registerCreateActions(registry);

    registry.add('action', 'backButton', goBackAction, {
        buttonIcon: <ArrowBack/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.action.goBack.name',
        targets: ['editHeaderPathActions:1']
    });

    // SelectorType actions
    const selectorTypes = Object.values(SelectorTypes);
    selectorTypes.forEach(selectorType => {
        if (selectorType.actions) {
            selectorType.actions(registry);
        }
    });
};
