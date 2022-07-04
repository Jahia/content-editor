import {Constants} from './Picker2.constants';

const treeConfigs = {
    content: {
        rootPath: site => `/sites/${site}/contents`,
        openableTypes: ['jnt:contentFolder'],
        selectableTypes: ['jnt:contentFolder'],
        type: 'contents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
    },
    default: {
        rootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        type: 'default',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.allContentsRootLabel'
    },
    files: {
        rootPath: site => `/sites/${site}/files`,
        openableTypes: ['nt:folder'],
        selectableTypes: ['nt:folder'],
        type: 'files',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.imagePicker.rootLabel'
    },
    pages: {
        rootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:virtualsite', 'jnt:navMenuText'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText'],
        type: 'pages',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.pagesRootLabel'
    },
    categories: {
        rootPath: () => '/sites/systemsite/categories',
        openableTypes: ['jnt:category'],
        selectableTypes: ['jnt:category'],
        type: 'categories',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.categoriesRootLabel'
    }
};
const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jmix:navMenuItem', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];

export const registerPickerConfig = ceRegistry => {
    const contentPicker = ceRegistry.get('selectorType', 'ContentPicker');
    ceRegistry.add(Constants.pickerConfig, 'editoriallink', {
        cmp: {
            picker: contentPicker,
            treeConfig: treeConfigs.default,
            searchSelectorType: 'jmix:searchable',
            listTypesTable: defaultEditorialListType,
            selectableTypesTable: defaultEditorialListType,
            showOnlyNodesWithTemplates: true
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'editorial', {
        cmp: {
            picker: contentPicker,
            treeConfig: treeConfigs.default,
            searchSelectorType: 'jmix:searchable',
            listTypesTable: defaultEditorialListType,
            selectableTypesTable: defaultEditorialListType
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'image', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'MediaPicker'),
            treeConfig: treeConfigs.files,
            searchSelectorType: 'jmix:image',
            listTypesTable: ['jmix:image'],
            selectableTypesTable: ['jmix:image']
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'folder', {
        cmp: {
            picker: {
                ...contentPicker,
                pickerInput: {
                    ...contentPicker.pickerInput,
                    emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.emptyFolderInput'
                },
                PickerDialog: {
                    ...contentPicker.PickerDialog,
                    dialogTitle: () => 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
                }
            },
            treeConfig: treeConfigs.files,
            searchSelectorType: 'jnt:folder',
            listTypesTable: ['jnt:folder'],
            selectableTypesTable: ['jnt:folder']
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'contentfolder', {
        cmp: {
            picker: {
                ...contentPicker,
                PickerDialog: {
                    ...contentPicker.PickerDialog,
                    dialogTitle: () => 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
                }
            },
            treeConfig: treeConfigs.content,
            searchSelectorType: 'jnt:contentFolder',
            listTypesTable: ['jnt:contentFolder'],
            selectableTypesTable: ['jnt:contentFolder']
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'page', {
        cmp: {
            picker: contentPicker,
            treeConfig: treeConfigs.pages,
            searchSelectorType: 'jnt:page',
            listTypesTable: ['jnt:page'],
            selectableTypesTable: ['jnt:page']
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'file', {
        cmp: {
            picker: {
                ...contentPicker,
                key: 'FilePicker',
                pickerInput: {
                    ...contentPicker.pickerInput,
                    emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addFile'
                },
                PickerDialog: {
                    ...contentPicker.PickerDialog,
                    dialogTitle: () => 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
                }
            },
            treeConfig: treeConfigs.files,
            searchSelectorType: 'jnt:file',
            listTypesTable: ['jnt:file'],
            selectableTypesTable: ['jnt:file']
        }
    });

    ceRegistry.add(Constants.pickerConfig, 'category', {
        cmp: {
            picker: contentPicker,
            treeConfig: treeConfigs.categories,
            searchSelectorType: 'jnt:category',
            listTypesTable: ['jnt:category'],
            selectableTypesTable: ['jnt:category'],
            targetSite: 'systemsite'
        }
    });
};
