import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {PickerTreeQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';

export const registerContentFolderPicker = registry => {
    registry.add(Constants.pickerConfig, 'contentfolder', mergeDeep({}, ContentPickerConfig, {
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
        searchSelectorType: 'jnt:contentFolder',
        selectableTypesTable: ['jnt:contentFolder']
    }));

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-content-folders-tree', {
        targets: ['contentfolder:60'],
        defaultPath: site => `/sites/${site}`,
        queryHandler: PickerTreeQueryHandler,
        config: {
            rootPath: '/contents',
            selectableTypes: ['jmix:cmContentTreeDisplayable', 'jmix:visibleInContentTree', 'jnt:contentFolder'],
            openableTypes: ['jmix:cmContentTreeDisplayable', 'jmix:visibleInContentTree', 'jnt:contentFolder']
        }
    }, renderer);
};
