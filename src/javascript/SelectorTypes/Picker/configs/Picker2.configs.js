import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';

export const registerPickerConfig = ceRegistry => {
    ceRegistry.add(Constants.pickerConfig, 'default', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:content', 'jnt:file', 'jnt:page', 'jmix:navMenuItem'],
        showOnlyNodesWithTemplates: false
    }));

    ceRegistry.add(Constants.pickerConfig, 'editoriallink', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jmix:mainResource'],
        showOnlyNodesWithTemplates: true
    }));

    ceRegistry.add(Constants.pickerConfig, 'editorial', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jmix:searchable',
        selectableTypesTable: ['jnt:page', 'jnt:contentList', 'jnt:contentFolder', 'jmix:siteContent', 'jmix:editorialContent']
    }));

    ceRegistry.add(Constants.pickerConfig, 'image', mergeDeep({}, MediaPickerConfig, {
        searchSelectorType: 'jmix:image',
        selectableTypesTable: ['jmix:image']
    }));

    ceRegistry.add(Constants.pickerConfig, 'folder', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.emptyFolderInput'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder',
            displayTree: false
        },
        pickerTable: {
            columns: ['name', 'lastModified']
        },
        searchSelectorType: 'jnt:folder',
        selectableTypesTable: ['jnt:folder']
    }));

    ceRegistry.add(Constants.pickerConfig, 'contentfolder', mergeDeep({}, ContentPickerConfig, {
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

    ceRegistry.add(Constants.pickerConfig, 'page', mergeDeep({}, ContentPickerConfig, {
        pickerDialog: {
            displayTree: false
        },
        pickerTable: {
            columns: ['name', 'lastModified']
        },
        searchSelectorType: 'jnt:page',
        selectableTypesTable: ['jnt:page']
    }));

    ceRegistry.add(Constants.pickerConfig, 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addFile'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder'
        },
        searchSelectorType: 'jnt:file',
        selectableTypesTable: ['jnt:file']
    }));

    ceRegistry.add(Constants.pickerConfig, 'category', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:category',
        selectableTypesTable: ['jnt:category'],
        accordionMode: `picker-${Constants.ACCORDION_ITEM_TYPES.CATEGORY}`,
        pickerTable: {
            columns: ['name']
        },
        pickerDialog: {
            displayTree: false
        }
    }));

    ceRegistry.add(Constants.pickerConfig, 'site', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:virtualsite',
        selectableTypesTable: ['jnt:virtualsite'],
        doNotUseJcontentPath: true,
        pickerTable: {
            columns: ['name']
        },
        pickerDialog: {
            displayTree: false
        }
    }));
};
