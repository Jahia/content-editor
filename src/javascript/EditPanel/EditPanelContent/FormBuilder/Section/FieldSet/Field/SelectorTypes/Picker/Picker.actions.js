import {Edit, Cancel, Launch, CloudUpload} from '@material-ui/icons';
import {menuAction} from '@jahia/react-material';
import {DotsVertical} from 'mdi-material-ui';
import React from 'react';
import {replaceAction} from './actions/replace.action';
import {unsetFieldAction} from '../../FieldsActions/unsetField.action';
import {openInTabAction} from './actions/openInTab.action';

const pickerActions = actionsRegistry => {
    actionsRegistry.add('ContentPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menu: 'ContentPickerActions',
        showIcons: true
    });

    actionsRegistry.add('MediaPickerMenu', menuAction, {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menu: 'MediaPickerActions',
        showIcons: true
    });

    actionsRegistry.add('replaceContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        target: ['ContentPickerActions:1', 'MediaPickerActions:1']
    });

    actionsRegistry.add('onpenInNewTab', openInTabAction, {
        buttonIcon: <Launch/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
        target: ['ContentPickerActions:2', 'MediaPickerActions:2']
    });

    actionsRegistry.add('unsetFieldActionPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        target: ['ContentPickerActions:3', 'MediaPickerActions:3']
    });

    actionsRegistry.add('upload', actionsRegistry.get('fileUpload'), {
        buttonIcon: <CloudUpload/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.fileUploadBtn',
        target: ['pickerDialogAction:0'],
        contentType: 'jnt:file',
        showOnNodeTypes: ['jnt:folder'],
        requiredPermission: 'jcr:addChildNodes'
    });
};

export default pickerActions;
