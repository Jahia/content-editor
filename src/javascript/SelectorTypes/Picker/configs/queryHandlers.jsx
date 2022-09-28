import {BaseQueryHandler, BaseTreeQueryHandler, SearchQueryHandler} from '@jahia/jcontent';
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
        getQueryVariables: p => ({
            ...queryHandler.getQueryVariables(p),
            selectableTypesTable: p.selectableTypesTable,
            typeFilter: Array.from(new Set([...p.selectableTypesTable, ...(p.openableTypes ? p.openableTypes : [])]))
        }),
        getFragments: () => [...queryHandler.getFragments(), selectableTypeFragment]
    };
}

export const PickerBaseQueryHandler = transformQueryHandler({
    ...BaseQueryHandler,
    getQueryVariables: p => ({
        ...BaseQueryHandler.getQueryVariables(p),
        fieldFilter: {
            multi: p.selectableFilter ? 'ANY' : 'NONE',
            filters: (p.selectableFilter ? p.selectableFilter : [])
        }
    })
});

export const PickerTreeQueryHandler = transformQueryHandler({
    ...BaseTreeQueryHandler,
    getQueryVariables: p => ({
        ...BaseTreeQueryHandler.getQueryVariables(p),
        fieldFilter: {
            multi: p.selectableFilter ? 'ANY' : 'NONE',
            filters: (p.selectableFilter ? p.selectableFilter : [])
        }
    })
});
const isSelectableFilter = [
    {
        fieldName: 'isSelectable',
        value: 'true'
    }
];
export const PickerSearchQueryHandler = transformQueryHandler({
    ...SearchQueryHandler,
    getQueryVariables: p => ({
        ...SearchQueryHandler.getQueryVariables(p),
        fieldFilter: {
            multi: 'ANY',
            filters: (p.selectableFilter ? p.selectableFilter : isSelectableFilter)
        }
    })
});
