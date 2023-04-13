import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {SiteWeb} from '@jahia/moonstone';
import {PickerBaseQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';
import {reactTable} from '@jahia/jcontent';
import {NoIconPickerCaption} from '~/SelectorTypes/Picker/configs/NoIconPickerCaption';

const nameColumn = {
    id: 'name',
    accessor: 'displayName',
    label: 'jcontent:label.contentManager.listColumns.name',
    sortable: true,
    property: 'displayName',
    Cell: reactTable.CellNameNoIcon,
    Header: reactTable.Header,
    width: '300px'
};

export const registerSitePicker = registry => {
    registry.add(Constants.pickerConfig, 'site', {
        searchContentType: 'jnt:virtualsite',
        selectableTypesTable: ['jnt:virtualsite'],
        pickerCaptionComponent: NoIconPickerCaption,
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle',
            displayTree: false,
            displaySiteSwitcher: false
        },
        selectionTable: {
            columns: [nameColumn]
        }
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.SITE}`, {
        targets: ['site:60'],
        icon: <SiteWeb/>,
        label: 'content-editor:label.contentEditor.picker.navigation.sites',
        rootPath: '/sites',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^\/sites\/[^/]*/.test(selectionNode.path) : folderNode.path === '/sites',
        tableConfig: {
            queryHandler: PickerBaseQueryHandler,
            defaultSort: {orderBy: 'displayName', order: 'ASC'},
            columns: [nameColumn]
        }
    }, renderer);
};
