import {ContentPickerSelectorType} from './ContentPicker';

const treeConfigs = {
    content: {
        rootPath: site => `/sites/${site}/contents`,
        openableTypes: ['jnt:contentFolder'],
        selectableTypes: ['jnt:contentFolder'],
        type: 'contents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
    },
    allContents: {
        rootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        type: 'allContents',
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
        selectableTypes: ['jnt:page'],
        type: 'pages',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.pagesRootLabel'
    },
    categories: {
        rootPath: () => '/sites/systemsite/categories',
        openableTypes: ['jnt:category'],
        selectableTypes: ['jnt:category'],
        type: 'categories',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.categoriesRootLabel'
    },
    sites: {
        rootPath: () => '/sites',
        openableTypes: ['jnt:virtualsitesFolder'],
        selectableTypes: ['jnt:virtualsitesFolder'],
        type: 'sites',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.sitesRootLabel'
    },
    users: {
        rootPath: () => '/users',
        openableTypes: ['jnt:usersFolder'],
        selectableTypes: ['jnt:usersFolder'],
        type: 'users',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.usersRootLabel'
    },
    siteUsers: {
        rootPath: site => `/sites/${site}/users`,
        openableTypes: ['jnt:usersFolder'],
        selectableTypes: ['jnt:usersFolder'],
        type: 'users',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.siteUsersRootLabel'
    },
    groups: {
        rootPath: () => '/groups',
        openableTypes: ['jnt:groupsFolder'],
        selectableTypes: ['jnt:groupsFolder'],
        type: 'groups',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.groupsRootLabel'
    },
    siteGroups: {
        rootPath: site => `/sites/${site}/groups`,
        openableTypes: ['jnt:groupsFolder'],
        selectableTypes: ['jnt:groupsFolder'],
        type: 'groups',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.siteGroupsRootLabel'
    }
};
const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jmix:navMenuItem', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];

export const registerPickerConfig = ceRegistry => {
    ceRegistry.add('pickerConfiguration', 'editoriallink', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'ContentPickerSelectorType'),
            treeConfigs: [treeConfigs.allContents],
            searchSelectorType: 'jmix:searchable',
            listTypesTable: defaultEditorialListType,
            selectableTypesTable: defaultEditorialListType,
            showOnlyNodesWithTemplates: true
        }
    });

    ceRegistry.add('pickerConfiguration', 'editorial', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'ContentPickerSelectorType'),
            treeConfigs: [treeConfigs.allContents],
            searchSelectorType: 'jmix:searchable',
            listTypesTable: defaultEditorialListType,
            selectableTypesTable: defaultEditorialListType
        }
    });

    ceRegistry.add('pickerConfiguration', 'image', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'MediaPickerSelectorType'),
            treeConfigs: [treeConfigs.files],
            searchSelectorType: 'jmix:image',
            listTypesTable: ['jmix:image'],
            selectableTypesTable: ['jmix:image']
        }
    });

    ceRegistry.add('pickerConfiguration', 'folder', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'ContentPickerSelectorType'),
            treeConfigs: [treeConfigs.files],
            searchSelectorType: 'jnt:folder',
            listTypesTable: ['jnt:folder'],
            selectableTypesTable: ['jnt:folder']
        }
    });

    ceRegistry.add('pickerConfiguration', 'contentfolder', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'ContentPickerSelectorType'),
            treeConfigs: [treeConfigs.content],
            searchSelectorType: 'jnt:contentFolder',
            listTypesTable: ['jnt:contentFolder'],
            selectableTypesTable: ['jnt:contentFolder']
        }
    });

    ceRegistry.add('pickerConfiguration', 'page', {
        cmp: {
            picker: ceRegistry.get('selectorType', 'ContentPickerSelectorType'),
            treeConfigs: [treeConfigs.pages],
            searchSelectorType: 'jnt:page',
            listTypesTable: ['jnt:page'],
            selectableTypesTable: ['jnt:page']
        }
    });

    ceRegistry.add('pickerConfiguration', 'file', {
        cmp: {
            picker: {
                ...ContentPickerSelectorType, key: 'FilePicker',
                pickerInput: {
                    ...ContentPickerSelectorType.pickerInput,
                    emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addFile'
                }
            },
            treeConfigs: [treeConfigs.files],
            searchSelectorType: 'jnt:file',
            listTypesTable: ['jnt:file'],
            selectableTypesTable: ['jnt:file']
        }
    });

    ceRegistry.add('pickerConfiguration', 'user', {
        cmp: {
            picker: ContentPickerSelectorType,
            treeConfigs: [treeConfigs.users, treeConfigs.siteUsers],
            searchSelectorType: 'jnt:user',
            searchPaths: site => ['/users', `/sites/${site}/users`],
            listTypesTable: ['jnt:user'],
            selectableTypesTable: ['jnt:user'],
            displayTree: false
        }
    });

    ceRegistry.add('pickerConfiguration', 'usergroup', {
        cmp: {
            picker: ContentPickerSelectorType,
            treeConfigs: [treeConfigs.groups, treeConfigs.siteGroups],
            searchSelectorType: 'jnt:group',
            searchPaths: site => ['/groups', `/sites/${site}/groups`],
            listTypesTable: ['jnt:group'],
            selectableTypesTable: ['jnt:group'],
            displayTree: false
        }
    });

    ceRegistry.add('pickerConfiguration', 'category', {
        cmp: {
            picker: ContentPickerSelectorType,
            treeConfigs: [treeConfigs.categories],
            searchSelectorType: 'jnt:category',
            listTypesTable: ['jnt:category'],
            selectableTypesTable: ['jnt:category']
        }
    });

    ceRegistry.add('pickerConfiguration', 'site', {
        cmp: {
            picker: ContentPickerSelectorType,
            treeConfigs: [treeConfigs.sites],
            searchSelectorType: 'jnt:virtualsite',
            listTypesTable: ['jnt:virtualsite'],
            selectableTypesTable: ['jnt:virtualsite']
        }
    });
};
