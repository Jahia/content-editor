import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {SiteWeb} from '@jahia/moonstone';
import {PickerBaseQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';
import {reactTable} from '@jahia/jcontent';
import {NoIconPickerCaption} from '~/SelectorTypes/Picker/configs/NoIconPickerCaption';

export const registerSitePicker = registry => {
    registry.add(Constants.pickerConfig, 'site', mergeDeep({}, ContentPickerConfig, {
        searchContentType: 'jnt:virtualsite',
        selectableTypesTable: ['jnt:virtualsite'],
        pickerCaptionComponent: NoIconPickerCaption,
        pickerTable: {
            columns: [{
                id: 'name',
                accessor: 'displayName',
                label: 'jcontent:label.contentManager.listColumns.name',
                sortable: true,
                property: 'displayName',
                Cell: reactTable.CellNameNoIcon,
                Header: reactTable.Header,
                width: '300px'
            }]
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
        rootPath: '/sites',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^\/sites\/.*/.test(selectionNode.path) : /^\/sites((\/.*)|$)/.test(folderNode.path),
        tableConfig: {
            queryHandler: PickerBaseQueryHandler,
            defaultSort: {orderBy: 'displayName', order: 'ASC'}
        }
    }, renderer);
};
