import {MediaPickerConfig} from '~/SelectorTypes/Picker/configs/MediaPickerConfig';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {reactTable} from '@jahia/jcontent';

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

    ceRegistry.add(Constants.pickerConfig, 'contentfolder', mergeDeep({}, ContentPickerConfig, {
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

    ceRegistry.add(Constants.pickerConfig, 'page', mergeDeep({}, ContentPickerConfig, {
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

    ceRegistry.add(Constants.pickerConfig, 'file', mergeDeep({}, ContentPickerConfig, {
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalFileTitle'
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
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalCategoryTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalCategoryTitle',
            displayTree: false,
            displaySiteSwitcher: false
        }
    }));

    ceRegistry.add(Constants.pickerConfig, 'site', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:virtualsite',
        selectableTypesTable: ['jnt:virtualsite'],
        pickerTable: {
            columns: ['name']
        },
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalSiteTitle',
            displayTree: false,
            displaySiteSwitcher: false
        }
    }));

    ceRegistry.add(Constants.pickerConfig, 'user', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:user',
        selectableTypesTable: ['jnt:user'],
        pickerTable: {
            columns: [
                'name',
                {
                    id: 'site',
                    accessor: 'siteInfo.displayName',
                    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.site',
                    sortable: true,
                    property: 'siteInfo.displayName',
                    Cell: reactTable.Cell,
                    Header: reactTable.Header,
                    width: '300px'
                },
                {
                    id: 'provider',
                    accessor: row => row.userFolderAncestors.map(f => f.path.match(/^.*\/providers\/([^/]+)$/)).filter(f => f).map(f => f[1]).join('') || 'default',
                    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.provider',
                    Cell: reactTable.Cell,
                    Header: reactTable.Header,
                    width: '300px'
                }
            ]
        },
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserTitle',
            displayTree: false,
            displaySiteSwitcher: false
        }
    }));
};
