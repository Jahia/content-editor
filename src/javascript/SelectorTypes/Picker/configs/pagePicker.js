import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {getPagesSearchContextData} from '~/SelectorTypes/Picker/configs/getPagesSearchContextData';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';

export const registerPagePicker = registry => {
    registry.add(Constants.pickerConfig, 'page', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPageTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalPageTitle',
            displayTree: false
        },
        pickerTable: {
            columns: ['name', 'lastModified']
        },
        searchSelectorType: 'jnt:page',
        selectableTypesTable: ['jnt:page']
    }));

    const pagesItem = registry.get(Constants.ACCORDION_ITEM_NAME, Constants.ACCORDION_ITEM_TYPES.PAGES);
    if (pagesItem) {
        // Pages tree
        registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-pages-tree', {
            ...pagesItem,
            viewSelector: null,
            tableHeader: null,
            getPathForItem: null,
            targets: ['page:50'],
            defaultSort: {orderBy: ''},
            getSearchContextData: getPagesSearchContextData,
            queryHandler: PickerTreeQueryHandler
        }, renderer);
    }
};
