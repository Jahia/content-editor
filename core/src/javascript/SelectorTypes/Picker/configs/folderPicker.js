import {Constants} from '../Picker.constants';
import {PickerTreeQueryHandler} from './queryHandlers';
import {renderer} from './renderer';
import {Collections} from '@jahia/moonstone';
import React from 'react';

export const registerFolderPicker = registry => {
    registry.add(Constants.pickerConfig, 'folder', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle',
            displayTree: false
        },
        searchContentType: 'jnt:folder',
        selectableTypesTable: ['jnt:folder'],
        selectionTable: {
            columns: ['publicationStatus', 'name', 'relPath']
        }
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-media-tree', {
        targets: ['folder:70'],
        icon: <Collections/>,
        label: 'jcontent:label.contentManager.navigation.media',
        rootPath: '/sites/{site}/files',
        tableConfig: {
            queryHandler: PickerTreeQueryHandler,
            hideRoot: false,
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            openableTypes: ['jnt:folder'],
            columns: ['name', 'lastModified'],
            contextualMenu: 'contentPickerMenu'
        }
    }, renderer);
};
