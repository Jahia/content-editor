import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';

const treeConfigs = {
    content: {
        getRootPath: site => `/sites/${site}/contents`,
        openableTypes: ['jnt:contentFolder'],
        selectableTypes: ['jnt:contentFolder'],
        type: 'contents',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.contentsRootLabel'
    },
    allContents: {
        getRootPath: site => `/sites/${site}`,
        openableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        selectableTypes: ['jnt:page', 'jnt:navMenuText', 'jnt:virtualsite', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent', 'jmix:browsableInEditorialPicker'],
        type: 'allContents',
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
    },
    sites: {
        getRootPath: () => '/sites',
        openableTypes: ['jnt:virtualsitesFolder'],
        selectableTypes: ['jnt:virtualsitesFolder'],
        type: 'sites',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.sitesRootLabel'
    },
    users: {
        getRootPath: () => '/users',
        openableTypes: ['jnt:usersFolder'],
        selectableTypes: ['jnt:usersFolder'],
        type: 'users',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.usersRootLabel'
    },
    siteUsers: {
        getRootPath: site => `/sites/${site}/users`,
        openableTypes: ['jnt:usersFolder'],
        selectableTypes: ['jnt:usersFolder'],
        type: 'users',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.siteUsersRootLabel'
    },
    groups: {
        getRootPath: () => '/groups',
        openableTypes: ['jnt:groupsFolder'],
        selectableTypes: ['jnt:groupsFolder'],
        type: 'groups',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.groupsRootLabel'
    },
    siteGroups: {
        getRootPath: site => `/sites/${site}/groups`,
        openableTypes: ['jnt:groupsFolder'],
        selectableTypes: ['jnt:groupsFolder'],
        type: 'groups',
        rootLabelKey: 'content-editor:label.contentEditor.edit.fields.contentPicker.siteGroupsRootLabel'
    }
};
const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jmix:navMenuItem', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];

export const registerPickerConfig = ceRegistry => {
    ceRegistry.add('pickerConfiguration', 'editoriallink', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.allContents],
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType,
        showOnlyNodesWithTemplates: true
    }));

    ceRegistry.add('pickerConfiguration', 'editorial', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.allContents],
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType
    }));

    ceRegistry.add('pickerConfiguration', 'image', mergeDeep({}, MediaPickerConfig, {
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jmix:image',
        listTypesTable: ['jmix:image'],
        selectableTypesTable: ['jmix:image']
    }));

    ceRegistry.add('pickerConfiguration', 'folder', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.emptyFolderInput'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder'
        },
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jnt:folder',
        listTypesTable: ['jnt:folder'],
        selectableTypesTable: ['jnt:folder']
    }));

    ceRegistry.add('pickerConfiguration', 'contentfolder', mergeDeep({}, ContentPickerConfig, {
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFolderTitle'
        },
        treeConfigs: [treeConfigs.content],
        searchSelectorType: 'jnt:contentFolder',
        listTypesTable: ['jnt:contentFolder'],
        selectableTypesTable: ['jnt:contentFolder']
    }));

    ceRegistry.add('pickerConfiguration', 'page', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.pages],
        searchSelectorType: 'jnt:page',
        listTypesTable: ['jnt:page'],
        selectableTypesTable: ['jnt:page']
    }));

    ceRegistry.add('pickerConfiguration', 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.addFile'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle',
            searchPlaceholder: 'content-editor:label.contentEditor.edit.fields.contentPicker.searchFilePlaceholder'
        },
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jnt:file',
        listTypesTable: ['jnt:file'],
        selectableTypesTable: ['jnt:file']
    }));

    ceRegistry.add('pickerConfiguration', 'user', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.users, treeConfigs.siteUsers],
        searchSelectorType: 'jnt:user',
        searchPaths: site => ['/users', `/sites/${site}/users`],
        listTypesTable: ['jnt:user'],
        selectableTypesTable: ['jnt:user'],
        pickerDialog: {
            displayTree: false
        }
    }));

    ceRegistry.add('pickerConfiguration', 'usergroup', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.groups, treeConfigs.siteGroups],
        searchSelectorType: 'jnt:group',
        searchPaths: site => ['/groups', `/sites/${site}/groups`],
        listTypesTable: ['jnt:group'],
        selectableTypesTable: ['jnt:group'],
        pickerDialog: {
            displayTree: false
        }
    }));

    ceRegistry.add('pickerConfiguration', 'category', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.categories],
        searchSelectorType: 'jnt:category',
        listTypesTable: ['jnt:category'],
        selectableTypesTable: ['jnt:category']
    }));

    ceRegistry.add('pickerConfiguration', 'site', mergeDeep({}, ContentPickerConfig, {
        treeConfigs: [treeConfigs.sites],
        searchSelectorType: 'jnt:virtualsite',
        listTypesTable: ['jnt:virtualsite'],
        selectableTypesTable: ['jnt:virtualsite']
    }));
};
