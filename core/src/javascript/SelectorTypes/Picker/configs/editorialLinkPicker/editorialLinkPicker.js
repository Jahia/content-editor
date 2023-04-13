import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {EditorialLinkContentTypeSelector} from './EditorialLinkContentTypeSelector';
import {renderer} from '../renderer';
import React from 'react';
import {PickerEditorialLinkQueryHandler} from './PickerEditorialLinkQueryHandler';
import {getPagesSearchContextData} from '~/SelectorTypes/Picker/configs/getPagesSearchContextData';

export const registerEditorialLinkPicker = registry => {
    registry.add(Constants.pickerConfig, 'editoriallink', {
        searchContentType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jmix:mainResource'],
        showOnlyNodesWithTemplates: true,
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalEditorialTitle',
            displayTree: false
        }
    });

    // Editorial link
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    if (pagesItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.EDITORIAL_LINK}`, {
            ...pagesItem,
            targets: ['editoriallink:40'],
            rootPath: '/sites/{site}',
            canDisplayItem: null,
            getPathForItem: node => node.site.path,
            getSearchContextData: getPagesSearchContextData,
            getViewTypeForItem: node => {
                const {CONTENT, PAGES} = Constants.tableView.type;
                const hasContentParent = node?.ancestors?.map(a => a.primaryNodeType.name)?.indexOf('jnt:contentFolder') > -1;
                return (node?.primaryNodeType.name !== 'jnt:page' && hasContentParent) ? CONTENT : PAGES;
            },
            tableConfig: {
                defaultSort: {orderBy: ''},
                queryHandler: PickerEditorialLinkQueryHandler,
                tableHeader: <EditorialLinkContentTypeSelector/>,
                defaultViewType: Constants.tableView.type.PAGES,
                uploadType: null,
                contextualMenu: 'contentPickerMenu'
            },
            treeConfig: {
                ...pagesItem.treeConfig,
                dnd: {}
            }
        }, renderer);
    }
};
