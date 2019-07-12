import {Edit, Cancel, Launch} from '@material-ui/icons';
import {menuAction} from '@jahia/react-material';
import {DotsVertical} from 'mdi-material-ui';
import React from 'react';
import {replaceAction} from './actions/replace.action';
import {unsetFieldAction} from '../../FieldsActions/unsetField.action';
import {openInTabAction} from './actions/openInTab.action';

const pickerActions = actionsRegistry => {
    actionsRegistry.add('ContentPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'ContentPickerActions',
        showIcons: true
    });

    actionsRegistry.add('MediaPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.moreOptions',
        menu: 'MediaPickerActions',
        showIcons: true
    });

    actionsRegistry.add('replaceContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.pickersAction.replace',
        target: ['ContentPickerActions:1', 'MediaPickerActions:1']
    });

    actionsRegistry.add('onpenInNewTab', openInTabAction, {
        buttonIcon: <Launch/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.pickersAction.newTab',
        target: ['ContentPickerActions:2', 'MediaPickerActions:2']
    });

    actionsRegistry.add('unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        target: ['ContentPickerActions:3', 'MediaPickerActions:3']
    });
};

export default pickerActions;
