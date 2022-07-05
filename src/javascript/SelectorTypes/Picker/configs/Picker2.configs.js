import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';

const treeConfigs = {
    content: {
        getRootPath: site => `/sites/${site}/contents`,
        openableTypes: ['jnt:contentFolder'],
        selectableTypes: ['jnt:contentFolder'],
        type: 'contents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
    },
    default: {
        getRootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        type: 'default',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.allContentsRootLabel'
    },
    files: {
        getRootPath: site => `/sites/${site}/files`,
        openableTypes: ['nt:folder'],
        selectableTypes: ['nt:folder'],
        type: 'files',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
    },
    pages: {
        getRootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText'],
        type: 'pages',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.pagesRootLabel'
    },
    categories: {
        getRootPath: () => '/sites/systemsite/categories',
        openableTypes: ['jnt:category'],
        selectableTypes: ['jnt:category'],
        type: 'categories',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.categoriesRootLabel'
    }
};
const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jmix:navMenuItem', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];

export const registerPickerConfig = ceRegistry => {
    ceRegistry.add('pickerConfiguration', 'editoriallink', {
        ...ContentPickerConfig,
        treeConfig: treeConfigs.default,
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType,
        showOnlyNodesWithTemplates: true
    });

    ceRegistry.add('pickerConfiguration', 'editorial', {
        ...ContentPickerConfig,
        treeConfig: treeConfigs.default,
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType
    });

    ceRegistry.add('pickerConfiguration', 'image', {
        ...MediaPickerConfig,
        treeConfig: treeConfigs.files,
        searchSelectorType: 'jmix:image',
        listTypesTable: ['jmix:image'],
        selectableTypesTable: ['jmix:image']
    });

    ceRegistry.add('pickerConfiguration', 'folder', {
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
        treeConfig: treeConfigs.files,
        searchSelectorType: 'jnt:folder',
        listTypesTable: ['jnt:folder'],
        selectableTypesTable: ['jnt:folder']
    });

    ceRegistry.add('pickerConfiguration', 'contentfolder', {
        ...ContentPickerConfig,
        PickerDialog: {
            ...ContentPickerConfig.PickerDialog,
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        treeConfig: treeConfigs.content,
        searchSelectorType: 'jnt:contentFolder',
        listTypesTable: ['jnt:contentFolder'],
        selectableTypesTable: ['jnt:contentFolder']
    });

    ceRegistry.add('pickerConfiguration', 'page', {
        ...ContentPickerConfig,
        treeConfig: treeConfigs.pages,
        searchSelectorType: 'jnt:page',
        listTypesTable: ['jnt:page'],
        selectableTypesTable: ['jnt:page']
    });

    ceRegistry.add('pickerConfiguration', 'file', {
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
        treeConfig: [treeConfigs.files],
        searchSelectorType: 'jnt:file',
        listTypesTable: ['jnt:file'],
        selectableTypesTable: ['jnt:file']
    });

    ceRegistry.add('pickerConfiguration', 'category', {
        ...ContentPickerConfig,
        treeConfig: treeConfigs.categories,
        searchSelectorType: 'jnt:category',
        listTypesTable: ['jnt:category'],
        selectableTypesTable: ['jnt:category']
    });
};
