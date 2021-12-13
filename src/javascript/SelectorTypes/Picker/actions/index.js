import React from 'react';
import {UnsetFieldActionComponent} from '../../actions/unsetField.action';
import {ReplaceActionComponent} from './replace.action';
import {Close, Edit, MoreVert, OpenInNew, Upload} from '@jahia/moonstone';
import {OpenInTabActionComponent} from './openInTab.action';

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

    registry.add('action', 'replaceContent', {
        component: ReplaceActionComponent,
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['content-editor/field/Picker:1', 'content-editor/field/MultiplePicker:1']
    });

    registry.add('action', 'openInNewTab', {
        component: OpenInTabActionComponent,
        buttonIcon: <OpenInNew/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        targets: ['content-editor/field/Picker:2', 'content-editor/field/MultiplePicker:2']
    });

    registry.add('action', 'unsetFieldActionPicker', {
        component: UnsetFieldActionComponent,
        buttonIcon: <Close/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/Picker:3']
    });

    console.log('registry', registry);

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
};
