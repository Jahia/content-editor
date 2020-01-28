import React from 'react';

import {Cancel, Add} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';

import {unsetFieldAction} from '../../FieldsActions/unsetField.action';
import {selectAllAction} from './MultipleSelect/actions/selectAll.action';

const choiceListActions = actionsRegistry => {
    actionsRegistry.add('action', 'ChoicelistMenu', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'ChoicelistActions',
        showIcons: true
    });

    actionsRegistry.add('action', 'unsetFieldActionChoiceList', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['ChoicelistActions:1']
    });

    actionsRegistry.add('action', 'selectAllActionChoiceList', selectAllAction, {
        buttonIcon: <Add/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.selectAll',
        targets: ['ChoicelistActions:2']
    });
};

export default choiceListActions;
