import React from 'react';

import {Cancel, Add} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';

import {unsetFieldAction} from '../actions/unsetField.action';
import {selectAllAction} from './MultipleSelect/actions/selectAll.action';

const registerChoiceListActions = registry => {
    registry.add('action', 'ChoicelistMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'ChoicelistActions',
        isShowIcons: true
    });

    registry.add('action', 'unsetFieldActionChoiceList', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['ChoicelistActions:1']
    });

    registry.add('action', 'selectAllActionChoiceList', selectAllAction, {
        buttonIcon: <Add/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.selectAll',
        targets: ['ChoicelistActions:2']
    });
};

export default registerChoiceListActions;
