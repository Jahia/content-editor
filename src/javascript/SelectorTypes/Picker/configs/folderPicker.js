import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';

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
        searchSelectorType: 'jnt:folder',
        selectableTypesTable: ['jnt:folder']
    }));

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-media-tree', {
        targets: ['folder:70'],
        defaultPath: site => `/sites/${site}`,
        defaultSort: {orderBy: 'lastModified.value', order: 'DESC'},
        queryHandler: PickerTreeQueryHandler,
        config: {
            rootPath: '/files',
            selectableTypes: ['jnt:folder'],
            openableTypes: ['jnt:folder']
        }
    }, renderer);
};
