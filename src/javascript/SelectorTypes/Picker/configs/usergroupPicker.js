import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {mergeDeep} from '~/SelectorTypes/Picker/Picker2.utils';
import {ContentPickerConfig} from '~/SelectorTypes/Picker/configs/ContentPickerConfig';
import {transformQueryHandler} from '~/SelectorTypes/Picker/accordionItems/QueryHandlers/queryHandlers';
import {Group} from '@jahia/moonstone';
import {renderer} from '~/SelectorTypes/Picker/accordionItems/renderer';
import React from 'react';
import {reactTable, Sql2SearchQueryHandler} from '@jahia/jcontent';
import {UserGroupPickerFragment} from './usergroupPicker.gql-queries';

const PickerUserGroupQueryHandler = transformQueryHandler({
    ...Sql2SearchQueryHandler,
    getQueryParams: p => ({
        ...Sql2SearchQueryHandler.getQueryParams(p),
        query: `SELECT * FROM ['jnt:group'] WHERE ISDESCENDANTNODE('/groups') OR ISDESCENDANTNODE('/sites/${p.siteKey}/groups')`
    }),
    getFragments: () => [UserGroupPickerFragment]
});

export const registerUsergroupPicker = registry => {
    registry.add(Constants.pickerConfig, 'usergroup', mergeDeep({}, ContentPickerConfig, {
        searchSelectorType: 'jnt:group',
        selectableTypesTable: ['jnt:group'],
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
                    accessor: row => row.userGroupFolderAncestors?.map(f => f.path.match(/^.*\/providers\/([^/]+)$/)).filter(f => f).map(f => f[1]).join('') || 'default',
                    label: 'content-editor:label.contentEditor.edit.fields.contentPicker.userPicker.provider',
                    Cell: reactTable.Cell,
                    Header: reactTable.Header,
                    width: '300px'
                }
            ]
        },
        pickerInput: {
            emptyLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserGroupTitle'
        },
        pickerDialog: {
            dialogTitle: 'content-editor:label.contentEditor.edit.fields.contentPicker.modalUserGroupTitle',
            displayTree: false,
            displaySiteSwitcher: false
        }
    }));

    registry.add(Constants.ACCORDION_ITEM_NAME, 'picker-usergroup', {
        targets: ['usergroup:50'],
        icon: <Group/>,
        label: 'content-editor:label.contentEditor.picker.navigation.usergroup',
        defaultPath: () => '/',
        canDisplayItem: node => /^\/sites\/[^/]+\/groups\/.*/.test(node.path),
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
        defaultSort: {orderBy: 'displayName', order: 'ASC'},
        queryHandler: PickerUserGroupQueryHandler,
        config: {
            rootPath: '',
            selectableTypes: ['jnt:group'],
            openableTypes: ['jnt:group']
        }
    }, renderer);
};
