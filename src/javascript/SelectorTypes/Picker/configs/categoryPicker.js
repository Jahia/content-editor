import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {Collections} from '@jahia/moonstone';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';

export const registerCategoryPicker = registry => {
    registry.add(Constants.pickerConfig, 'category', {
        searchContentType: 'jnt:category',
        selectableTypesTable: ['jnt:category'],
        accordionMode: `picker-${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`,
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalCategoryTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalCategoryTitle',
            displayTree: false,
            displaySiteSwitcher: false
        },
        selectionTable: {
            columns: ['name', 'relPath']
        }
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`, {
        targets: ['category:50'],
        icon: <Collections/>,
        label: 'content-editor:label.contentEditor.picker.navigation.categories',
        rootPath: '/sites/systemsite/categories',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^\/sites\/systemsite\/categories\/.*/.test(selectionNode.path) : /^\/sites\/systemsite\/categories((\/.*)|$)/.test(folderNode.path),
        tableConfig: {
            queryHandler: PickerTreeQueryHandler,
            openableTypes: ['jnt:category'],
            defaultSort: {orderBy: 'displayName', order: 'ASC'},
            columns: ['name']
        }
    }, renderer);
};
