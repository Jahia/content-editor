import React from 'react';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {reactTable, Sql2SearchQueryHandler} from '@jahia/jcontent';
import {FolderUser} from '@jahia/moonstone';
import {transformQueryHandler} from '~/SelectorTypes/Picker/accordionItems/QueryHandlers/queryHandlers';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import {UserPickerFragment} from './userPicker.gql-queries';

const PickerUserQueryHandler = transformQueryHandler({
    ...Sql2SearchQueryHandler,
    getQueryParams: p => ({
        ...Sql2SearchQueryHandler.getQueryParams(p),
        query: `SELECT * FROM ['jnt:user'] WHERE ISDESCENDANTNODE('/users') OR ISDESCENDANTNODE('/sites/${p.siteKey}/users')`
    }),
    getFragments: () => [UserPickerFragment]
});

export const registerUserPicker = registry => {
    registry.add(Constants.pickerConfig, 'user', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:user',
        selectableTypesTable: ['jnt:user'],
        pickerTable: {
            columns: [
                {
                    id: 'name',
                    accessor: row => row.firstName?.value || row.lastName?.value ? `${row.firstName ? row.firstName.value : ''} ${row.lastName ? row.lastName.value : ''} (${row.name})` : row.name,
                    label: 'jcontent:label.contentManager.listColumns.name',
                    sortable: true,
                    property: 'displayName',
                    Cell: reactTable.CellName,
                    Header: reactTable.Header,
                    width: '300px'
                },
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
                    accessor: row => row.userFolderAncestors?.map(f => f.path.match(/^.*\/providers\/([^/]+)$/)).filter(f => f).map(f => f[1]).join('') || 'default',
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

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-user', {
        targets: ['user:50'],
        icon: <FolderUser/>,
        label: 'content-editor:label.contentEditor.picker.navigation.users',
        defaultPath: () => '/',
        canDisplayItem: node => /^\/sites\/[^/]+\/users\/.*/.test(node.path),
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
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerUserQueryHandler,
        config: {
            rootPath: '',
            selectableTypes: ['jnt:user'],
            openableTypes: ['jnt:user']
        }
    }, renderer);
};
