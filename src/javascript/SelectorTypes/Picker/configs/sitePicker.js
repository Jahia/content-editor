import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {SiteWeb} from '@jahia/moonstone';
import {PickerBaseQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';

export const registerSitePicker = registry => {
    registry.add(Constants.pickerConfig, 'site', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:virtualsite',
        selectableTypesTable: ['jnt:virtualsite'],
        pickerTable: {
            columns: ['name']
        },
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle',
            displayTree: false,
            displaySiteSwitcher: false
        }
    }));

    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.SITE}`, {
        targets: ['site:60'],
        icon: <SiteWeb/>,
        label: 'content-editor:label.contentEditor.picker.navigation.sites',
        defaultPath: () => '/sites',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^\/sites\/.*/.test(selectionNode.path) : /^\/sites((\/.*)|$)/.test(folderNode.path),
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerBaseQueryHandler,
        config: {
            rootPath: '',
            selectableTypes: ['jnt:virtualsite'],
            openableTypes: ['jnt:virtualsite'],
            rootLabel: 'Sites - This is never shown'
        }
    }, renderer);
};
