import {BaseTreeQueryHandler, BaseQueryHandler, SearchQueryHandler} from '@jahia/jcontent';
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
            selectableTypesTable: p.params.selectableTypesTable,
            typeFilter: Array.from(new Set([...p.params.selectableTypesTable, ...(p.params.openableTypes ? p.params.openableTypes : [])]))
        }),
        getFragments: () => [...queryHandler.getFragments(), selectableTypeFragment]
    };
}

export const PickerBaseQueryHandler = transformQueryHandler(BaseQueryHandler);

export const PickerTreeQueryHandler = transformQueryHandler(BaseTreeQueryHandler);

export const PickerSearchQueryHandler = transformQueryHandler({
    ...SearchQueryHandler,
    getQueryVariables: p => ({
        ...SearchQueryHandler.getQueryVariables(p),
        fieldFilter: {
            filters: {
                fieldName: 'isSelectable',
                value: 'true'
            }
        }
    })
});
