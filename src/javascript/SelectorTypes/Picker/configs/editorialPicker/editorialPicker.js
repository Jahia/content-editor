import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {getPagesSearchContextData} from '~/SelectorTypes/Picker/configs/getPagesSearchContextData';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';
import {ContentFoldersQueryHandler, ViewModeSelector} from '@jahia/jcontent';
import {cePickerSetTableViewMode} from '~/SelectorTypes/Picker/Picker.redux';
import {EditorialContentTypeSelector} from './EditorialContentTypeSelector';
import {PickerPagesQueryHandler} from '~/SelectorTypes/Picker/configs/editorialPicker/PickerPagesQueryHandler';

const viewModeSelectorProps = {
    selector: state => ({
        mode: state.contenteditor.picker.mode,
        viewMode: state.contenteditor.picker.tableView.viewMode
    }),
    setTableViewModeAction: mode => cePickerSetTableViewMode(mode)
};

const PickerContentsFolderQueryHandler = transformQueryHandler({
    ...ContentFoldersQueryHandler,
    getQueryVariables: p => ({
        ...ContentFoldersQueryHandler.getQueryVariables(p),
        fieldFilter: {
            multi: p.tableDisplayFilter ? 'ANY' : 'NONE',
            filters: (p.tableDisplayFilter ? p.tableDisplayFilter : [])
        }
    })
});

export const registerEditorialPicker = registry => {
    registry.add(Constants.pickerConfig, 'editorial', {
        searchContentType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jnt:contentList', 'jnt:contentFolder', 'jmix:siteContent', 'jmix:editorialContent']
    });

    registry.add(Constants.pickerConfig, 'droppableContent', {
        searchContentType: 'jmix:searchable',
        selectableTypesTable: ['jmix:droppableContent']
    });

    // These are jcontent accordion items, additional targets are added to enhance selection
    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    const contentFoldersItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS);

    if (pagesItem) {
        // Page content
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.PAGES}`, {
            ...pagesItem,
            targets: ['default:50', 'editorial:50', 'droppableContent:50'],
            getSearchContextData: getPagesSearchContextData,
            tableConfig: {
                queryHandler: PickerPagesQueryHandler,
                defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
                viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
                tableHeader: <EditorialContentTypeSelector/>,
                uploadType: null,
                contextualMenu: 'contentPickerMenu',
                autoExpandLevels: 2
            },
            treeConfig: {
                ...pagesItem.treeConfig,
                dnd: {}
            }
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for pages');
    }

    if (contentFoldersItem) {
        registry.add(Constants.ACCORDION_ITEM_NAME, `picker-${Constants.ACCORDION_ITEM_TYPES.CONTENT_FOLDERS}`, {
            ...contentFoldersItem,
            targets: ['default:60', 'editorial:60', 'droppableContent:60'],
            tableConfig: {
                queryHandler: PickerContentsFolderQueryHandler,
                openableTypes: ['jnt:contentFolder'],
                viewSelector: <ViewModeSelector {...viewModeSelectorProps}/>,
                uploadType: null,
                contextualMenu: 'contentPickerMenu',
                canAlwaysDoubleClickOnType: type => ['jnt:contentFolder'].includes(type)
            },
            treeConfig: {
                ...contentFoldersItem.treeConfig,
                dnd: {}
            }
        }, renderer);
    } else {
        console.warn('Picker will not function properly due to missing accordionItem for content-folders');
    }
};
