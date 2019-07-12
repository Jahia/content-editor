import React from 'react';

import {Cancel} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';
import {menuAction} from '@jahia/react-material';

import {unsetFieldAction} from '../../FieldsActions/unsetField.action';

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
};

export default choiceListActions;
