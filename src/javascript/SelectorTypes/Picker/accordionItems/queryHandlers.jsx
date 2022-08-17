import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    BaseDescendantsQuery,
    BaseQueryHandler,
    ContentFoldersQueryHandler,
    FilesQueryHandler,
    PagesQueryHandler,
    SearchQueryHandler
} from '@jahia/jcontent';
import gql from 'graphql-tag';

const selectableTypeFragment = {
    gql: gql`fragment IsSelectable on JCRNode {
        isSelectable: isNodeType(type: {types: $selectableTypesTable})
    }`,
    variables: {
        selectableTypesTable: '[String!]!'
    },
    applyFor: 'node'
};

export function transformQueryHandler(queryHandler) {
    return {
        ...queryHandler,
        getQueryParams: p => ({
            ...queryHandler.getQueryParams(p),
            selectableTypesTable: p.params.selectableTypesTable,
            typeFilter: Array.from(new Set([...p.params.selectableTypesTable, 'jnt:contentFolder', 'jnt:folder']))
        }),
        getFragments: () => [...queryHandler.getFragments(), selectableTypeFragment]
    };
}

export const PickerContentsFolderQueryHandler = transformQueryHandler(ContentFoldersQueryHandler);

export const PickerFilesQueryHandler = transformQueryHandler(FilesQueryHandler);

export const PickerBaseQueryHandler = transformQueryHandler(BaseQueryHandler);

export const PickerTreeQueryHandler = {
    ...BaseQueryHandler,
    getQuery: () => BaseDescendantsQuery,
    getQueryParams: p => ({
        ...BaseQueryHandler.getQueryParams(p),
        selectableTypesTable: p.params.selectableTypesTable,
        typeFilter: p.params.selectableTypesTable,
        recursionTypesFilter: {multi: 'NONE', types: []},
        offset: 0,
        limit: 10000
    }),
    getResults: (data, {path}) => BaseQueryHandler.structureData(path, BaseQueryHandler.getResults(data)),
    getFragments: () => [...BaseQueryHandler.getFragments(), selectableTypeFragment]
};

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,
    getQueryParams: p => ({
        ...PagesQueryHandler.getQueryParams(p),
        selectableTypesTable: p.params.selectableTypesTable,
        typeFilter: Constants.tableView.type.PAGES === p.tableView.viewType ? ['jnt:page'] : p.params.selectableTypesTable.filter(t => t !== 'jnt:page')
    }),
    getFragments: () => [...PagesQueryHandler.getFragments(), selectableTypeFragment]
};

export const PickerSearchQueryHandler = {
    ...SearchQueryHandler,
    getQueryParams: p => ({
        ...SearchQueryHandler.getQueryParams(p),
        selectableTypesTable: p.params.selectableTypesTable,
        typeFilter: Array.from(new Set([...p.params.selectableTypesTable, 'jnt:contentFolder', 'jnt:folder'])),
        fieldFilter: {
            filters: {
                fieldName: 'isSelectable',
                value: 'true'
            }
        }
    }),
    getFragments: () => [...SearchQueryHandler.getFragments(), selectableTypeFragment]
};
