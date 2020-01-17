import {useContentEditorContext} from '~/ContentEditor.context';
import {useQuery} from 'react-apollo-hooks';
import {ContentDialogPickerQuery, SearchContentDialogPickerQuery} from './content.gql-queries';

export const useDialogPickerContent = (pickerConfig, selectedPath, searchTerms) => {
    // Build table config from picker config
    const tableConfig = {
        typeFilter: pickerConfig.selectableTypesTable,
        recursionTypesFilter: ['nt:base'],
        showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates,
        searchSelectorType: pickerConfig.searchSelectorType
    };

    const editorContext = useContentEditorContext();

    const queryData = useQuery(
        searchTerms ? SearchContentDialogPickerQuery : ContentDialogPickerQuery,
        {
            variables: {
                path: selectedPath,
                language: editorContext.lang,
                searchTerms,
                searchName: '%' + searchTerms + '%',
                searchSelectorType: tableConfig.searchSelectorType,
                typeFilter: tableConfig.typeFilter,
                recursionTypesFilter: tableConfig.recursionTypesFilter,
                fieldFilter: tableConfig.showOnlyNodesWithTemplates ? {
                    filters: [{
                        fieldName: 'isDisplayableNode',
                        evaluation: 'EQUAL',
                        value: 'true'
                    }]
                } : null
            }
        });

    if (queryData.loading || queryData.error) {
        return queryData;
    }

    return {
        ...queryData,
        nodes: searchTerms ?
            queryData.data.jcr.result.nodes :
            queryData.data.jcr.result.descendants.nodes,
        totalCount: searchTerms ?
            queryData.data.jcr.retrieveTotalCount.pageInfo.totalCount :
            queryData.data.jcr.result.retrieveTotalCount.pageInfo.totalCount
    };
};
