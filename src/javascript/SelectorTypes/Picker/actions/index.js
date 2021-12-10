import {Cancel, Edit, Launch} from '@material-ui/icons';
import {FileUpload} from 'mdi-material-ui';
import React from 'react';
import {unsetFieldAction} from '../../actions/unsetField.action';
import {openInTabAction} from './openInTab.action';
import {replaceAction} from './replace.action';
import {MoreVert} from "@jahia/moonstone";

export const registerPickerActions = registry => {
    registry.add('action', 'ContentPickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'ContentPickerActions',
        menuItemProps: {
            isShowIcons: true
        },
        displayFieldActions: (field, value) => {
            return !field.multiple && value;
        }
    });

    registry.add('action', 'MediaPickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'MediaPickerActions',
        menuItemProps: {
            isShowIcons: true
        },
        displayFieldActions: (field, value) => {
            return !field.multiple && value;
        }
    });

    registry.add('action', 'FilePickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'FilePickerActions',
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
        targets: ['ContentPickerActions:1', 'MediaPickerActions:1', 'FilePickerActions:1']
    });

    registry.add('action', 'openInNewTab', openInTabAction, {
        buttonIcon: <Launch/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        targets: ['ContentPickerActions:2', 'MediaPickerActions:2', 'FilePickerActions:2']
    });

    registry.add('action', 'unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['ContentPickerActions:3', 'MediaPickerActions:3', 'FilePickerActions:3']
    });

    console.log('registry', registry);

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
