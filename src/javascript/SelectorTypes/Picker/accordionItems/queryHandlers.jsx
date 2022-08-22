import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';
import {
    BaseDescendantsQuery,
    BaseQueryHandler,
    ContentFoldersQueryHandler,
    FilesQueryHandler,
    PagesQueryHandler,
    SearchQueryHandler,
    Sql2SearchQueryHandler
} from '@jahia/jcontent';
import gql from 'graphql-tag';
import {UserPickerFragment} from '~/SelectorTypes/Picker/accordionItems/QueryHandlers/queryHandler.gql-queries';

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
            typeFilter: Array.from(new Set([...p.params.selectableTypesTable, ...(p.params.openableTypes ? p.params.openableTypes : [])]))
        }),
        getFragments: () => [...queryHandler.getFragments(), selectableTypeFragment]
    };
}

export const PickerContentsFolderQueryHandler = transformQueryHandler(ContentFoldersQueryHandler);

export const PickerFilesQueryHandler = transformQueryHandler(FilesQueryHandler);

export const PickerBaseQueryHandler = transformQueryHandler(BaseQueryHandler);

export const PickerTreeQueryHandler = transformQueryHandler({
    ...BaseQueryHandler,
    getQuery: () => BaseDescendantsQuery,
    getQueryParams: p => ({
        ...BaseQueryHandler.getQueryParams(p),
        recursionTypesFilter: {multi: 'NONE', types: []},
        offset: 0,
        limit: 10000
    }),
    isStructured: () => true
});

export const PickerPagesQueryHandler = {
    ...PagesQueryHandler,
    getQueryParams: p => ({
        ...PagesQueryHandler.getQueryParams(p),
        selectableTypesTable: p.params.selectableTypesTable,
        typeFilter: Constants.tableView.type.PAGES === p.tableView.viewType ? ['jnt:page'] : p.params.selectableTypesTable.filter(t => t !== 'jnt:page')
    }),
    getFragments: () => [...PagesQueryHandler.getFragments(), selectableTypeFragment]
};

export const PickerSearchQueryHandler = transformQueryHandler({
    ...SearchQueryHandler,
    getQueryParams: p => ({
        ...SearchQueryHandler.getQueryParams(p),
        fieldFilter: {
            filters: {
                fieldName: 'isSelectable',
                value: 'true'
            }
        }
    })
});

export const PickerUserQueryHandler = transformQueryHandler({
    ...Sql2SearchQueryHandler,
    getQueryParams: p => Sql2SearchQueryHandler.getQueryParams({
        ...p,
        params: {
            sql2SearchFrom: 'jnt:user',
            searchPath: '/users'
        }
    }),
    getFragments: () => [UserPickerFragment]
});
