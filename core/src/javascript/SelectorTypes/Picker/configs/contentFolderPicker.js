import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {FolderSpecial} from '@jahia/moonstone';
import React from 'react';

export const registerContentFolderPicker = registry => {
    registry.add(Constants.pickerConfig, 'contentfolder', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle',
            displayTree: false
        },
        searchContentType: 'jnt:contentFolder',
        selectableTypesTable: ['jnt:contentFolder']
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-content-folders-tree', {
        targets: ['contentfolder:60'],
        icon: <FolderSpecial/>,
        label: 'jcontent:label.contentManager.navigation.contentFolders',
        rootPath: '/sites/{site}/contents',
        tableConfig: {
            queryHandler: PickerTreeQueryHandler,
            openableTypes: ['jmix:cmContentTreeDisplayable', 'jmix:visibleInContentTree', 'jnt:contentFolder'],
            columns: ['name', 'lastModified'],
            contextualMenu: 'contentPickerMenu'
        }
    }, renderer);
};
