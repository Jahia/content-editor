import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {registerUserPicker} from '~/SelectorTypes/Picker/configs/userPicker';
import {registerUsergroupPicker} from '~/SelectorTypes/Picker/configs/usergroupPicker';
import {registerCategoryPicker} from '~/SelectorTypes/Picker/configs/categoryPicker';
import {registerSitePicker} from '~/SelectorTypes/Picker/configs/sitePicker';
import {registerFolderPicker} from '~/SelectorTypes/Picker/configs/folderPicker';
import {registerContentFolderPicker} from '~/SelectorTypes/Picker/configs/contentFolderPicker';

export const registerPickerConfig = registry => {
    registry.add(Constants.pickerConfig, 'default', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:content', 'jnt:file', 'jnt:page', 'jmix:navMenuItem'],
        showOnlyNodesWithTemplates: false
    }));

    registry.add(Constants.pickerConfig, 'editoriallink', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jmix:mainResource'],
        showOnlyNodesWithTemplates: true,
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalEditorialTitle',
            displayTree: false
        }
    }));

    registry.add(Constants.pickerConfig, 'editorial', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jnt:contentList', 'jnt:contentFolder', 'jmix:siteContent', 'jmix:editorialContent']
    }));

    registry.add(Constants.pickerConfig, 'image', mergeDeep({}, MediaPickerConfig, {
        searchSelectorType: 'jmix:image',
        selectableTypesTable: ['jmix:image']
    }));

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

    registry.add(Constants.pickerConfig, 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        searchSelectorType: 'jnt:file',
        selectableTypesTable: ['jnt:file']
    }));

    registerFolderPicker(registry);
    registerContentFolderPicker(registry);
    registerSitePicker(registry);
    registerCategoryPicker(registry);
    registerUsergroupPicker(registry);
    registerUserPicker(registry);
};
