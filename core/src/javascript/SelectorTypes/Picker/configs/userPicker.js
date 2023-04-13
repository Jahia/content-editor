import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker.constants';
import {reactTable, Sql2SearchQueryHandler} from '@jahia/jcontent';
import {FolderUser} from '@jahia/moonstone';
import {transformQueryHandler} from '~/SelectorTypes/Picker/configs/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/configs/renderer';
import {UserPickerFragment} from './userPicker.gql-queries';
import {NoIconPickerCaption} from '~/SelectorTypes/Picker/configs/NoIconPickerCaption';

const PickerUserQueryHandler = transformQueryHandler({
    ...Sql2SearchQueryHandler,
    getQueryVariables: p => ({
        ...Sql2SearchQueryHandler.getQueryVariables(p),
        query: `SELECT * FROM ['jnt:user'] WHERE ISDESCENDANTNODE('/users') OR ISDESCENDANTNODE('/sites/${p.siteKey}/users')`
    }),
    getFragments: () => [UserPickerFragment]
});

const nameColumn = {
    id: 'name',
    accessor: row => row.firstName?.value || row.lastName?.value ? `${row.firstName ? row.firstName.value : ''} ${row.lastName ? row.lastName.value : ''} (${row.name})` : row.name,
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
    accessor: row => row.userFolderAncestors?.map(f => f.path.match(/^.*\/providers\/([^/]+)$/)).filter(f => f).map(f => f[1]).join('') || 'default',
    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.provider',
    Cell: reactTable.Cell,
    Header: reactTable.Header,
    width: '300px'
};

export const registerUserPicker = registry => {
    registry.add(Constants.pickerConfig, 'user', {
        searchContentType: 'jnt:user',
        selectableTypesTable: ['jnt:user'],
        pickerCaptionComponent: NoIconPickerCaption,
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserTitle',
            displayTree: false,
            displaySiteSwitcher: false
        },
        selectionTable: {
            getFragments: () => [UserPickerFragment],
            columns: [nameColumn]
        }
    });

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-user', {
        targets: ['user:50'],
        icon: <FolderUser/>,
        label: 'content-editor:label.contentEditor.picker.navigation.users',
        rootPath: '/',
        canDisplayItem: ({selectionNode, folderNode}) => selectionNode ? /^(\/sites\/[^/]+)?\/users\/.*/.test(selectionNode.path) : folderNode.path === '/',
        getSearchContextData: ({currentSite, t}) => {
            return [
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.search'),
                    searchPath: '',
                    isDisabled: true
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.allUsers'),
                    searchPath: '/',
                    iconStart: <FolderUser/>
                },
                {
                    label: t('content-editor:label.contentEditor.picker.rightPanel.searchContextOptions.globalUsers'),
                    searchPath: '/users',
                    iconStart: <FolderUser/>
                },
                ...(currentSite ? [{
                    label: currentSite.substring(0, 1).toUpperCase() + currentSite.substring(1),
                    searchPath: `/sites/${currentSite}/users`,
                    iconStart: <FolderUser/>
                }] : [])
            ];
        },
        tableConfig: {
            queryHandler: PickerUserQueryHandler,
            defaultSort: {orderBy: 'displayName', order: 'ASC'},
            columns: [nameColumn, siteColumn, providerColumn]
        }
    }, renderer);
};
