import {MediaPickerSelectorType} from './MediaPicker';
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
const defaultEditorialListType = ['jmix:editorialContent', 'jnt:page', 'jnt:contentList', 'jnt:contentFolder', 'nt:folder', 'jmix:siteContent'];
const pickerConfigs = {
    image: {
        picker: MediaPickerSelectorType,
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jmix:image',
        listTypesTable: ['jmix:image'],
        selectableTypesTable: ['jmix:image']
    },
    folder: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jnt:folder',
        listTypesTable: ['jnt:folder'],
        selectableTypesTable: ['jnt:folder']
    },
    contentfolder: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.content],
        searchSelectorType: 'jnt:contentFolder',
        listTypesTable: ['jnt:contentFolder'],
        selectableTypesTable: ['jnt:contentFolder']
    },
    page: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.pages],
        searchSelectorType: 'jnt:page',
        listTypesTable: ['jnt:page'],
        selectableTypesTable: ['jnt:page']
    },
    editorial: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.allContents],
        searchSelectorType: 'jmix:searchable',
        listTypesTable: defaultEditorialListType,
        selectableTypesTable: defaultEditorialListType
    },
    get editoriallink() {
        return {
            ...this.editorial,
            showOnlyNodesWithTemplates: true
        };
    },
    file: {
        picker: {...ContentPickerSelectorType, key: 'FilePicker'},
        treeConfigs: [treeConfigs.files],
        searchSelectorType: 'jnt:file',
        listTypesTable: ['jnt:file'],
        selectableTypesTable: ['jnt:file']
    },
    user: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.users, treeConfigs.siteUsers],
        searchSelectorType: 'jnt:user',
        searchPaths: site => ['/users', `/sites/${site}/users`],
        listTypesTable: ['jnt:user'],
        selectableTypesTable: ['jnt:user'],
        displayTree: false
    },
    usergroup: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.users, treeConfigs.siteUsers, treeConfigs.groups, treeConfigs.siteGroups],
        searchSelectorType: 'jnt:user',
        listTypesTable: ['jnt:user', 'jnt:group'],
        selectableTypesTable: ['jnt:user', 'jnt:group']
    },
    category: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.categories],
        searchSelectorType: 'jnt:category',
        listTypesTable: ['jnt:category'],
        selectableTypesTable: ['jnt:category']
    },
    site: {
        picker: ContentPickerSelectorType,
        treeConfigs: [treeConfigs.sites],
        searchSelectorType: 'jnt:virtualsite',
        listTypesTable: ['jnt:virtualsite'],
        selectableTypesTable: ['jnt:virtualsite']
    },
    getPickerSelectorType(options) {
        return this[this._getPickerType(options)].picker;
    },
    resolveConfig(options, field) {
        const config = Object.assign({}, this[this._getPickerType(options)]);
        if (field && field.valueConstraints) {
            const constraints = field.valueConstraints.map(constraint => constraint.value.string);
            if (constraints && constraints.length > 0) {
                config.selectableTypesTable = constraints;
            }
        }

        return config;
    },
    _getPickerType(options) {
        const option = options && options.find(option => option.name === 'type' && this[option.value]);
        return (option && option.value) || 'editorial';
    }
};

export default pickerConfigs;
