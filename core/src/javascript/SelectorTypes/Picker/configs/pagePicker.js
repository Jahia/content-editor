import {Constants} from '../Picker.constants';
import {getPagesSearchContextData} from './getPagesSearchContextData';
import {PickerTreeQueryHandler} from './queryHandlers';
import {renderer} from './renderer';

export const registerPagePicker = registry => {
    registry.add(Constants.pickerConfig, 'page', {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPageTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPageTitle',
            displayTree: false
        },
        selectionTable: {
            columns: ['publicationStatus', 'name', 'relPath']
        },
        searchContentType: 'jnt:page',
        selectableTypesTable: ['jnt:page']
    });

    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    if (pagesItem) {
        // Pages tree
        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-pages-tree', {
            ...pagesItem,
            targets: ['page:50'],
            getPathForItem: null,
            getSearchContextData: getPagesSearchContextData,
            tableConfig: {
                queryHandler: PickerTreeQueryHandler,
                defaultSort: {orderBy: ''},
                columns: ['publicationStatus', 'name', 'lastModified'],
                contextualMenu: 'contentPickerMenu',
                openableTypes: ['jmix:navMenuItem']
            },
            treeConfig: {
                ...pagesItem.treeConfig,
                dnd: {}
            }
        }, renderer);
    }
};
