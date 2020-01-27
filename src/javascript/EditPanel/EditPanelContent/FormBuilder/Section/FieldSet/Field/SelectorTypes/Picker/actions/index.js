import {Edit, Cancel, Launch} from '@material-ui/icons';
import {DotsVertical, FileUpload} from 'mdi-material-ui';
import React from 'react';
import {unsetFieldAction} from '../../../FieldsActions/unsetField.action';
import {openInTabAction} from './openInTab.action';
import {replaceAction} from './replace.action';

export const pickerActions = actionsRegistry => {
    actionsRegistry.add('ContentPickerMenu', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menu: 'ContentPickerActions',
        showIcons: true
    });

    actionsRegistry.add('MediaPickerMenu', actionsRegistry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menu: 'MediaPickerActions',
        showIcons: true
    });

    actionsRegistry.add('action', 'replaceContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['ContentPickerActions:1', 'MediaPickerActions:1']
    });

    actionsRegistry.add('action', 'onpenInNewTab', openInTabAction, {
        buttonIcon: <Launch/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        targets: ['ContentPickerActions:2', 'MediaPickerActions:2']
    });

    actionsRegistry.add('action', 'unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['ContentPickerActions:3', 'MediaPickerActions:3']
    });

    const fileUploadCMMAction = {
        ...actionsRegistry.get('fileUpload'),
        targets: null // Remove target to avoid entry duplication
    };
    actionsRegistry.add('action', 'upload', fileUploadCMMAction, {
        buttonIcon: <FileUpload/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.fileUploadBtn',
        targets: ['pickerDialogAction:0'],
        contentType: 'jnt:file'
    });
};
