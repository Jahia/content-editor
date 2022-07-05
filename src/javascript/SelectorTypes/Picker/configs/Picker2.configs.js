import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jmix:navMenuItem', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];

export const registerPickerConfig = ceRegistry => {
    ceRegistry.add(Constants.pickerConfig, 'editoriallink', {
        ...ContentPickerConfig,
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType,
        showOnlyNodesWithTemplates: true
    });

    ceRegistry.add(Constants.pickerConfig, 'editorial', {
        ...ContentPickerConfig,
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType
    });

    ceRegistry.add(Constants.pickerConfig, 'image', {
        ...MediaPickerConfig,
        searchSelectorType: 'jmix:image',
        listTypesTable: ['jmix:image'],
        selectableTypesTable: ['jmix:image']
    });

    ceRegistry.add(Constants.pickerConfig, 'folder', {
        ...ContentPickerConfig,
        pickerInput: {
            ...ContentPickerConfig.pickerInput,
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.emptyFolderInput'
        },
        PickerDialog: {
            ...ContentPickerConfig.PickerDialog,
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder'
        },
        searchSelectorType: 'jnt:folder',
        listTypesTable: ['jnt:folder'],
        selectableTypesTable: ['jnt:folder']
    });

    ceRegistry.add(Constants.pickerConfig, 'contentfolder', {
        ...ContentPickerConfig,
        PickerDialog: {
            ...ContentPickerConfig.PickerDialog,
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        searchSelectorType: 'jnt:contentFolder',
        listTypesTable: ['jnt:contentFolder'],
        selectableTypesTable: ['jnt:contentFolder']
    });

    ceRegistry.add(Constants.pickerConfig, 'page', {
        ...ContentPickerConfig,
        searchSelectorType: 'jnt:page',
        listTypesTable: ['jnt:page'],
        selectableTypesTable: ['jnt:page']
    });

    ceRegistry.add(Constants.pickerConfig, 'file', {
        ...ContentPickerConfig,
        pickerInput: {
            ...ContentPickerConfig.pickerInput,
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addFile'
        },
        PickerDialog: {
            ...ContentPickerConfig.PickerDialog,
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder'
        },
        searchSelectorType: 'jnt:file',
        listTypesTable: ['jnt:file'],
        selectableTypesTable: ['jnt:file']
    });

    ceRegistry.add(Constants.pickerConfig, 'category', {
        ...ContentPickerConfig,
        searchSelectorType: 'jnt:category',
        listTypesTable: ['jnt:category'],
        selectableTypesTable: ['jnt:category']
    });
};
