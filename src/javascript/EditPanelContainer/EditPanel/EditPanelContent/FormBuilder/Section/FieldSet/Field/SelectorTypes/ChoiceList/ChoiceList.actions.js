import React from 'react';

import {Cancel, Add} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';
import {menuAction} from '@jahia/react-material';

import {unsetFieldAction} from '../../FieldsActions/unsetField.action';
import {selectAllAction} from './MultipleSelect/actions/selectAll.action';

const choiceListActions = actionsRegistry => {
    actionsRegistry.add('ChoicelistMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'ChoicelistActions',
        showIcons: true
    });

    actionsRegistry.add('unsetFieldActionChoiceList', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        target: ['ChoicelistActions:1']
    });

    actionsRegistry.add('selectAllActionChoiceList', selectAllAction, {
        buttonIcon: <Add/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.selectAll',
        target: ['ChoicelistActions:2']
    });
};

export default choiceListActions;
