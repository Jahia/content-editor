import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {Group} from '@jahia/moonstone';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import React from 'react';
import {reactTable, Sql2SearchQueryHandler} from '@jahia/jcontent';
import {UserGroupPickerFragment} from './usergroupPicker.gql-queries';
import {NoIconPickerCaption} from '~/SelectorTypes/Picker/configs/NoIconPickerCaption';

const PickerUserGroupQueryHandler = transformQueryHandler({
    ...Sql2SearchQueryHandler,
    getQueryVariables: p => ({
        ...Sql2SearchQueryHandler.getQueryVariables(p),
        query: `SELECT * FROM ['jnt:group'] WHERE ISDESCENDANTNODE('/groups') OR ISDESCENDANTNODE('/sites/${p.siteKey}/groups')`
    }),
    getFragments: () => [UserGroupPickerFragment]
});

const nameColumn = {
    id: 'name',
    accessor: 'displayName',
    label: 'jcontent:label.contentManager.listColumns.name',
    sortable: true,
    property: 'displayName',
    Cell: reactTable.CellNameNoIcon,
    Header: reactTable.Header,
    width: '300px'
};

const siteColumn = {
    id: 'site',
    accessor: 'siteInfo.displayName',
    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.site',
    sortable: true,
    property: 'siteInfo.displayName',
    Cell: reactTable.Cell,
    Header: reactTable.Header,
    width: '300px'
};

const providerColumn = {
    id: 'provider',
    accessor: row => row.userGroupFolderAncestors?.map(f => f.path.match(/^.*\/providers\/([^/]+)$/)).filter(f => f).map(f => f[1]).join('') || 'default',
    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.provider',
    Cell: reactTable.Cell,
    Header: reactTable.Header,
    width: '300px'
};

export const registerUsergroupPicker = registry => {
    registry.add(Constants.pickerConfig, 'usergroup', {
        searchContentType: 'jnt:group',
        selectableTypesTable: ['jnt:group'],
        pickerCaptionComponent: NoIconPickerCaption,
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserGroupTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserGroupTitle',
            displayTree: false,
            displaySiteSwitcher: false
        },
        selectionTable: {
            columns: [nameColumn]
        }
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-usergroup', {
        targets: ['usergroup:50'],
        icon: <Group/>,
        label: 'content-editor:label.contentEditor.picker.navigation.usergroup',
        rootPath: '/',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^(\/sites\/[^/]+)?\/groups\/.*/.test(selectionNode.path) : folderNode.path === '/',
        getSearchContextData: ({currentSite, t}) => {
            return [
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.search'),
                    searchPath: '',
                    isDisabled: true
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.allGroups'),
                    searchPath: '/',
                    iconStart: <Group/>
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.globalGroups'),
                    searchPath: '/groups',
                    iconStart: <Group/>
                },
                ...(currentSite ? [{
                    label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
                    searchPath: `/sites/${currentSite}/groups`,
                    iconStart: <Group/>
                }] : [])
            ];
        },
        tableConfig: {
            queryHandler: PickerUserGroupQueryHandler,
            defaultSort: {orderBy: 'displayName', order: 'ASC'},
            columns: [nameColumn, siteColumn, providerColumn]
        }
    }, renderer);
};
