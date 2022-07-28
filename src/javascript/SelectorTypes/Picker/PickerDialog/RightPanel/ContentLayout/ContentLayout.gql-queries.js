import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';
import {Constants} from '~/SelectorTypes/Picker/Picker2.constants';

const childNodesCount = gql`
    fragment ChildNodesCount on JCRNode {
        subNodes: children(typesFilter: {types: ["jnt:file", "jnt:folder", "jnt:content", "jnt:contentFolder"], multi: ANY}) {
            pageInfo {
                totalCount
            }
        }
    }
`;

const mixinTypes = gql`
    query mixinTypes($path: String!) {
        jcr {
            nodeByPath(path: $path) {
                mixinTypes {
                    name
                }
            }
        }
    }
`;
const nodeFields = gql`
    fragment NodeFields on JCRNode {
        name
        displayName(language: $language)
        createdBy: property(name: "jcr:createdBy") {
            value
        }
        created: property(name: "jcr:created") {
            value
        }
        primaryNodeType {
            name
            displayName(language: $displayLanguage)
            icon
        }
        mixinTypes {
            name
        }
        operationsSupport {
            lock
            markForDeletion
            publication
        }
        aggregatedPublicationInfo(language: $language) {
            publicationStatus
        }
        lockOwner: property(name: "jcr:lockOwner") {
            value
        }
        lastPublished: property(name: "j:lastPublished", language: $language) {
            value
        }
        lastPublishedBy: property(name: "j:lastPublishedBy", language: $language) {
            value
        }
        lastModifiedBy: property(name: "jcr:lastModifiedBy", language: $language) {
            value
        }
        lastModified: property(name: "jcr:lastModified", language: $language) {
            value
        }
        deletedBy: property(name: "j:deletionUser", language: $language) {
            value
        }
        deleted: property(name: "j:deletionDate", language: $language) {
            value
        }
        wipStatus: property(name: "j:workInProgressStatus") {
            value
        }
        wipLangs: property(name: "j:workInProgressLanguages") {
            values
        }
        ancestors(fieldFilter: {filters: {fieldName: "deletionDate", evaluation: NOT_EMPTY}}) {
            deletionDate:property(name: "j:deletionDate") {
                value
            }
            deletionUser: property(name: "j:deletionUser") {
                value
            }
        }
        notSelectableForPreview: isNodeType(type: {types:["jnt:page", "jnt:folder", "jnt:contentFolder"]})
        isSelectable: isNodeType(type: {types: $selectableTypesTable})
        site {
            ...NodeCacheRequiredFields
        }
        parent {
            ...NodeCacheRequiredFields
            path
        }
        ...NodeCacheRequiredFields
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

class ContentQueryHandler {
    getQuery() {
        return gql`
            query getNodeSubTree($path:String!, $language:String!, $offset:Int, $limit:Int, $displayLanguage:String!, $typeFilter:[String]!, $recursionTypesFilter: InputNodeTypesInput, $fieldSorter: InputFieldSorterInput, $fieldGrouping: InputFieldGroupingInput, $selectableTypesTable: [String]!) {
                jcr {
                    nodeByPath(path: $path) {
                        ...NodeFields
                        descendants(offset:$offset, limit:$limit, typesFilter: {types: $typeFilter, multi: ANY}, recursionTypesFilter: $recursionTypesFilter, fieldSorter: $fieldSorter, fieldGrouping: $fieldGrouping) {
                            pageInfo {
                                totalCount
                            }
                            nodes {
                                ...NodeFields
                                ...ChildNodesCount
                            }
                        }
                    }
                }
            }
            ${nodeFields}
            ${childNodesCount}
        `;
    }

    getQueryParams({path, uilang, lang, params, pagination, sort, viewType}) {
        let type = params.type;

        const paramsByBrowseType = {
            pages: {
                typeFilter: Constants.tableView.type.PAGES === viewType ? ['jnt:page'] : ['jnt:editorialContent'],
                recursionTypesFilter: {multi: 'NONE', types: ['jnt:page', 'jnt:contentFolder']}
            },
            'content-folders': {
                typeFilter: ['jnt:content', 'jnt:contentFolder'],
                recursionTypesFilter: {multi: 'NONE', types: ['nt:base']}
            }
        };

        if (params.typeFilter) {
            paramsByBrowseType[type].typeFilter = params.typeFilter[viewType];
        }

        if (params.recursionTypesFilter) {
            paramsByBrowseType[type].recursionTypesFilter = params.recursionTypesFilter[viewType];
        }

        return {
            path: path,
            language: lang,
            displayLanguage: uilang,
            offset: pagination.currentPage * pagination.pageSize,
            limit: pagination.pageSize,
            typeFilter: paramsByBrowseType[type].typeFilter,
            selectableTypesTable: params.selectableTypesTable,
            recursionTypesFilter: paramsByBrowseType[type].recursionTypesFilter,
            fieldSorter: sort.orderBy === '' ? null : {
                sortType: sort.order === '' ? null : (sort.order === 'DESC' ? 'ASC' : 'DESC'),
                fieldName: sort.orderBy === '' ? null : sort.orderBy,
                ignoreCase: true
            },
            fieldGrouping: {
                fieldName: 'primaryNodeType.name',
                groups: paramsByBrowseType[type].recursionTypesFilter,
                groupingType: 'START'
            }
        };
    }

    updateQueryParamsForStructuredView(params, viewType, mode) {
        const p = {
            ...params,
            fieldGrouping: null,
            offset: 0,
            limit: 10000
        };

        if (mode === Constants.mode.CONTENT_FOLDERS) {
            p.recursionTypesFilter = {multi: 'NONE', types: ['jnt:contentFolder']};
            p.typeFilter = ['jnt:content'];
        } else if (viewType === Constants.tableView.type.CONTENT) {
            p.recursionTypesFilter = {types: ['jnt:content']};
            p.typeFilter = ['jnt:content'];
        } else if (viewType === Constants.tableView.type.PAGES) {
            p.recursionTypesFilter = {types: ['jnt:page']};
            p.typeFilter = ['jnt:page'];
        }

        return p;
    }

    getResultsPath(data) {
        return data && data.jcr && data.jcr.nodeByPath && data.jcr.nodeByPath.descendants;
    }
}

class FilesQueryHandler {
    getQuery() {
        return gql`
            query getFiles($path:String!, $language:String!, $offset:Int, $limit:Int, $displayLanguage:String!, $typeFilter:[String]!, $fieldSorter: InputFieldSorterInput, $fieldGrouping: InputFieldGroupingInput, $recursionTypesFilter: InputNodeTypesInput, $selectableTypesTable: [String]!) {
                jcr {
                    nodeByPath(path: $path) {
                        ...NodeFields
                        descendants(offset: $offset, limit: $limit, typesFilter: {types: $typeFilter, multi: ANY}, recursionTypesFilter: $recursionTypesFilter, fieldSorter: $fieldSorter, fieldGrouping: $fieldGrouping) {
                            pageInfo {
                                totalCount
                            }
                            nodes {
                                ...NodeFields
                                ...ChildNodesCount
                                width: property(name: "j:width") {
                                    value
                                }
                                height: property(name: "j:height") {
                                    value
                                }
                                children(typesFilter: {types: ["jnt:resource"]}) {
                                    nodes {
                                        ...NodeCacheRequiredFields
                                        data: property(name: "jcr:data") {
                                            size
                                        }
                                        mimeType: property(name: "jcr:mimeType") {
                                            value
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ${nodeFields}
            ${childNodesCount}
            ${PredefinedFragments.nodeCacheRequiredFields.gql}
        `;
    }

    getQueryParams({path, uilang, lang, pagination, sort, params}) {
        return {
            path: path,
            language: lang,
            displayLanguage: uilang,
            offset: pagination.currentPage * pagination.pageSize,
            limit: pagination.pageSize,
            typeFilter: params.typeFilter.media,
            selectableTypesTable: params.selectableTypesTable,
            recursionTypesFilter: {multi: 'NONE', types: ['jnt:folder']},
            fieldSorter: sort.orderBy === '' ? null : {
                sortType: sort.order === '' ? null : (sort.order === 'DESC' ? 'ASC' : 'DESC'),
                fieldName: sort.orderBy === '' ? null : sort.orderBy,
                ignoreCase: true
            },
            fieldGrouping: {
                fieldName: 'primaryNodeType.name',
                groups: ['jnt:folder'],
                groupingType: 'START'
            }
        };
    }

    updateQueryParamsForStructuredView(params) {
        return {
            ...params,
            fieldGrouping: null,
            recursionTypesFilter: null,
            offset: 0,
            limit: 10000
        };
    }

    getResultsPath(data) {
        return data && data.jcr && data.jcr.nodeByPath && data.jcr.nodeByPath.descendants;
    }
}

class SearchQueryHandler {
    getQuery() {
        return gql`
            query searchContentQuery($searchPath:String!, $nodeType:String!, $searchTerms:String!, $nodeNameSearchTerms:String!, $language:String!, $displayLanguage:String!, $offset:Int, $limit:Int, $fieldSorter: InputFieldSorterInput) {
                jcr {
                    nodesByCriteria(
                        criteria: {
                            language: $language,
                            nodeType: $nodeType,
                            paths: [$searchPath],
                            nodeConstraint: {
                                any: [
                                    {contains: $searchTerms}
                                    {contains: $searchTerms, property: "j:tagList"}
                                    {like: $nodeNameSearchTerms, property: "j:nodename"}
                                ]
                            }
                        },
                        offset: $offset,
                        limit: $limit,
                        fieldSorter: $fieldSorter
                    ) {
                        pageInfo {
                            totalCount
                        }
                        nodes {
                            ...NodeFields
                        }
                    }
                }
            }
            ${nodeFields}
        `;
    }

    getQueryParams({uilang, lang, params, pagination, sort}) {
        return {
            searchPath: params.searchPath,
            nodeType: (params.searchContentType || 'jmix:searchable'),
            searchTerms: params.searchTerms,
            nodeNameSearchTerms: `%${params.searchTerms}%`,
            language: lang,
            displayLanguage: uilang,
            offset: pagination.currentPage * pagination.pageSize,
            limit: pagination.pageSize,
            fieldSorter: sort.orderBy === '' ? null : {
                sortType: sort.order === '' ? null : (sort.order === 'DESC' ? 'ASC' : 'DESC'),
                fieldName: sort.orderBy === '' ? null : sort.orderBy,
                ignoreCase: true
            }
        };
    }

    updateQueryParamsForStructuredView(params) {
        return params;
    }

    getResultsPath(data) {
        return data && data.jcr && data.jcr.nodesByCriteria;
    }
}

const contentQueryHandlerByMode = mode => {
    switch (mode) {
        case Constants.mode.MEDIA:
            return new FilesQueryHandler();
        case Constants.mode.SEARCH:
            return new SearchQueryHandler();
        default:
            return new ContentQueryHandler();
    }
};

export {
    ContentQueryHandler,
    SearchQueryHandler,
    FilesQueryHandler,
    mixinTypes,
    contentQueryHandlerByMode
};
