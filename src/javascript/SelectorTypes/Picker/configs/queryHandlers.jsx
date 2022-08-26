import {BaseDescendantsQuery, BaseQueryHandler, SearchQueryHandler} from '@jahia/jcontent';
import gql from 'graphql-tag';

export const selectableTypeFragment = {
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
