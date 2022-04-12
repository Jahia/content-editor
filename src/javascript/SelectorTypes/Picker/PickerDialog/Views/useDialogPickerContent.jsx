import {useQuery} from '@apollo/react-hooks';
import {ContentDialogPickerQuery, SearchContentDialogPickerQuery} from './content.gql-queries';
import {useContentEditorContext} from '~/ContentEditor.context';

const NB_OF_ELEMENT_PER_PAGE = 20;

export const useDialogPickerContent = ({lang, pickerConfig, selectedPath, searchTerms, fieldSorter}) => {
    const {site} = useContentEditorContext();
    // Build table config from picker config
    const tableConfig = {
        typeFilter: pickerConfig.listTypesTable,
        selectableTypeFilter: pickerConfig.selectableTypesTable,
        recursionTypesFilter: ['nt:base'],
        showOnlyNodesWithTemplates: pickerConfig.showOnlyNodesWithTemplates,
        searchSelectorType: pickerConfig.searchSelectorType
    };

    console.log('conf', pickerConfig, tableConfig);
    const queryData = useQuery(
        searchTerms ? SearchContentDialogPickerQuery : ContentDialogPickerQuery,
        {
            variables: {
                path: selectedPath,
                searchPaths: pickerConfig.searchPaths ? pickerConfig.searchPaths(site) : [selectedPath],
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

    // THIS IS A ROUGH IN, very rough!!! Extracts mime types from selector options and construct query
    let sql2Query = `SELECT * FROM [jnt:file] as f INNER JOIN [jnt:resource] AS jcrcontent ON ISCHILDNODE(jcrcontent, f) WHERE ISDESCENDANTNODE(f, '${selectedPath}') AND (CONTAINS(jcrcontent.['jcr:mimeType'], 'fakeStuffBecauseImLazy')`;
    pickerConfig.selectorOptions.find(o => o.name === 'mimetypes').value.split(',').forEach(mimeType => sql2Query += ` OR CONTAINS(jcrcontent.['jcr:mimeType'], '${mimeType}')`);
    sql2Query += ')';

    const sql2Data = useQuery(
        pickerConfig.contentQuery,
        {
            variables: {
                query: sql2Query,
                offset: 0,
                limit: NB_OF_ELEMENT_PER_PAGE,
                language: lang,
                fieldSorter
            }
        });

    console.log('Result for mimeType restricted query', sql2Data);

    if (!sql2Data.loading && !sql2Data.error) {
        console.log("Return sql2 data");
        return {
            nodes: sql2Data.data.jcr.result.nodes,
            fetchMore: sql2Data.fetchMore,
            hasMore: sql2Data.data.jcr.result.pageInfo.hasNextPage,
            totalCount: sql2Data.data.jcr.result.pageInfo.totalCount
        }
    }

    // Spike modifications end here

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
