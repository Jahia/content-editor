import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {Collections} from '@jahia/moonstone';
import React from 'react';

export const registerFolderPicker = registry => {
    registry.add(Constants.pickerConfig, 'folder', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle',
            displayTree: false
        },
        pickerTable: {
            columns: ['name', 'lastModified']
        },
        searchContentType: 'jnt:folder',
        selectableTypesTable: ['jnt:folder']
    }));

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-media-tree', {
        targets: ['folder:70'],
        icon: <Collections/>,
        label: 'jcontent:label.contentManager.navigation.media',
        rootPath: '/sites/{site}/files',
        tableConfig: {
            queryHandler: PickerTreeQueryHandler,
            hideRoot: false,
            defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
            openableTypes: ['jnt:folder']
        }
    }, renderer);
};
