import React from 'react';
import {unsetFieldAction} from '~/SelectorTypes/actions/unsetFieldAction';
import {Close, Edit, MoreVert, Upload, Visibility} from '@jahia/moonstone';
import {replaceAction} from './replaceAction';
import {openInTabAction} from './openInTabAction';
import {previewInTabAction} from './previewInTabAction';

export const registerPickerActions = registry => {
    registry.add('action', 'content-editor/field/Picker', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/Picker',
        menuItemProps: {
            isShowIcons: true
        }
    });

    registry.add('action', 'content-editor/field/MultiplePicker', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/MultiplePicker',
        menuItemProps: {
            isShowIcons: true
        }
    });

    registry.add('action', 'replaceContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['content-editor/field/Picker:1', 'content-editor/field/MultiplePicker:1']
    });

    registry.add('action', 'openInNewTab', openInTabAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        targets: ['content-editor/field/Picker:2', 'content-editor/field/MultiplePicker:2']
    });

    registry.add('action', 'unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Close/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/Picker:3']
    });

    const fileUploadJContentAction = {
        ...registry.get('action', 'fileUpload'),
        targets: null // Remove target to avoid entry duplication
    };
    registry.add('action', 'upload', fileUploadJContentAction, {
        buttonIcon: <Upload/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.fileUploadBtn',
        targets: ['pickerDialogAction:0'],
        contentType: 'jnt:file',
        dataSelRole: 'upload'
    });

    registry.add('action', 'previewInNewTab', previewInTabAction, {
        buttonIcon: <Visibility/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.previewTab',
        targets: ['content-editor/field/Picker:3', 'content-editor/field/MultiplePicker:3']
    });
};
