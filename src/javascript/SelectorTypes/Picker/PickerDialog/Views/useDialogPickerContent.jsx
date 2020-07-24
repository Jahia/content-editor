import {useQuery} from '@apollo/react-hooks';
import {ContentDialogPickerQuery, SearchContentDialogPickerQuery} from './content.gql-queries';

const NB_OF_ELEMENT_PER_PAGE = 20;

export const useDialogPickerContent = ({lang, pickerConfig, selectedPath, searchTerms, fieldSorter}) => {
    // Build table config from picker config
    const tableConfig = {
        typeFilter: pickerConfig.listTypesTable,
        selectableTypeFilter: pickerConfig.selectableTypesTable,
        recursionTypesFilter: ['nt:base'],
        showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates,
        searchSelectorType: pickerConfig.searchSelectorType
    };

    const queryData = useQuery(
        searchTerms ? SearchContentDialogPickerQuery : ContentDialogPickerQuery,
        {
            variables: {
                path: selectedPath,
                offset: 0,
                limit: NB_OF_ELEMENT_PER_PAGE,
                language: lang,
                searchTerms,
                searchName: '%' + searchTerms + '%',
                searchSelectorType: tableConfig.searchSelectorType,
                typeFilter: tableConfig.typeFilter,
                selectableTypeFilter: tableConfig.selectableTypeFilter,
                recursionTypesFilter: tableConfig.recursionTypesFilter,
                fieldSorter
            }
        });

    if (queryData.loading || queryData.error) {
        return queryData;
    }

    const totalCount = searchTerms ?
        queryData.data.jcr.result.pageInfo.totalCount :
        queryData.data.jcr.result.descendants.pageInfo.totalCount;

    const nodes = searchTerms ?
        queryData.data.jcr.result.nodes :
        queryData.data.jcr.result.descendants.nodes;

    return {
        ...queryData,
        nodes,
        totalCount,
        hasMore: nodes.length < totalCount,
        loadMore: page => {
            queryData.fetchMore({
                variables: {
                    offset: page * NB_OF_ELEMENT_PER_PAGE
                },
                updateQuery: (prev, {fetchMoreResult}) => {
                    if (!fetchMoreResult) {
                        return prev;
                    }

                    if (searchTerms) {
                        return {
                            ...prev,
                            jcr: {
                                ...prev.jcr,
                                result: {
                                    ...prev.jcr.result,
                                    nodes: [
                                        ...prev.jcr.result.nodes,
                                        ...fetchMoreResult.jcr.result.nodes
                                    ]
                                }
                            }
                        };
                    }

                    return {
                        ...prev,
                        jcr: {
                            ...prev.jcr,
                            result: {
                                ...prev.jcr.result,
                                descendants: {
                                    ...prev.jcr.result.descendants,
                                    nodes: [
                                        ...prev.jcr.result.descendants.nodes,
                                        ...fetchMoreResult.jcr.result.descendants.nodes
                                    ]
                                }
                            }
                        }
                    };
                }
            });
        }
    };
};
