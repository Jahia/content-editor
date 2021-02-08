import {Edit, Cancel, Launch} from '@material-ui/icons';
import {DotsVertical, FileUpload} from 'mdi-material-ui';
import React from 'react';
import {unsetFieldAction} from '../../actions/unsetField.action';
import {openInTabAction} from './openInTab.action';
import {replaceAction} from './replace.action';

export const registerPickerActions = registry => {
    registry.add('action', 'ContentPickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'ContentPickerActions',
        isShowIcons: true,
        displayFieldActions: (field, value) => {
            return !field.multiple && value;
        }
    });

    registry.add('action', 'MediaPickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'MediaPickerActions',
        menuItemProps: {
            isShowIcons: true
        },
        displayFieldActions: (field, value) => {
            return !field.multiple && value;
        }
    });

    registry.add('action', 'replaceContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['ContentPickerActions:1', 'MediaPickerActions:1']
    });

    registry.add('action', 'openInNewTab', openInTabAction, {
        buttonIcon: <Launch/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        targets: ['ContentPickerActions:2', 'MediaPickerActions:2']
    });

    registry.add('action', 'unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['ContentPickerActions:3', 'MediaPickerActions:3']
    });

    const fileUploadJContentAction = {
        ...registry.get('action', 'fileUpload'),
        targets: null // Remove target to avoid entry duplication
    };
    registry.add('action', 'upload', fileUploadJContentAction, {
        buttonIcon: <FileUpload/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.fileUploadBtn',
        targets: ['pickerDialogAction:0'],
        contentType: 'jnt:file',
        dataSelRole: 'upload'
    });
};
