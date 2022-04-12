import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const SubContentsCountQuery = gql`
    query subContentsCountQuery($path: String!, $typeFilter: [String]!, $limit: Int!) {
        forms {
            subContentsCount(nodePath: $path, includeTypes: $typeFilter, limit: $limit)
        }
    }
`;

// Use this query, ideal we want to have multiple mime types so need to refactor this to make it possible
export const ContentDialogPickerQuery = gql`
    query pickerDialogSQLQuery(
        $query: String!,
        $language: String!,
        $offset: Int!,
        $limit: Int!,
        $fieldSorter: InputFieldSorterInput
    ) {
        jcr {
            result: nodesByQuery(query: $query, offset: $offset, limit: $limit, fieldSorter: $fieldSorter) {
                pageInfo {
                    totalCount
                    hasNextPage
                }
                nodes {
                    displayName(language: $language)
                    primaryNodeType {
                        name
                        typeName: displayName(language: $language)
                        icon
                    }
                    createdBy: property(name: "jcr:createdBy") {
                        value
                    }
                    lastModified: property(name: "jcr:lastModified") {
                        value
                    }
                    isDisplayableNode
                    width: property(name: "j:width") {
                        value
                    }
                    height: property(name: "j:height") {
                        value
                    }
                    metadata: children(names: ["jcr:content"]) {
                        nodes {
                            mimeType: property(name: "jcr:mimeType") {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const SearchContentDialogPickerQuery = gql`
    query searchPickerQuery(
        $searchPaths: [String]!,
        $language: String!,
        $searchTerms: String!,
        $searchName: String!,
        $searchSelectorType: String!,
        $selectableTypeFilter: [String]!,
        $offset: Int!,
        $limit: Int!
    ) {
        jcr {
            result: nodesByCriteria(
                criteria: {
                    language: $language,
                    nodeType: $searchSelectorType,
                    paths: $searchPaths,
                    nodeConstraint: {any: [
                        {contains: $searchTerms}
                        {contains: $searchTerms, property: "jcr:content"}
                        {contains: $searchTerms, property: "jcr:description"}
                        {contains: $searchTerms, property: "jcr:title"}
                        {contains: $searchTerms, property: "j:keywords"}
                        {like: $searchName, property: "j:nodename"}
                        {equals: $searchTerms, property: "j:tagList"}
                    ]},
                    ordering: {orderType: DESC, property: "score()"}
                },
                offset: $offset,
                limit: $limit
            ) {
                pageInfo {
                    totalCount
                }
                nodes {
                    displayName(language: $language)
                    name
                    primaryNodeType {
                        typeName: displayName(language: $language)
                        icon
                    }
                    createdBy: property(name: "jcr:createdBy") {
                        value
                    }
                    isDisplayableNode
                    isNodeType(type:{types: $selectableTypeFilter, multi: ANY})
                    lastModified: property(name: "jcr:lastModified") {
                        value
                    }

                    # Specific section for images
                    width: property(name: "j:width") {
                        value
                    }
                    height: property(name: "j:height") {
                        value
                    }
                    metadata: children(names: ["jcr:content"]) {
                        nodes {
                            mimeType: property(name: "jcr:mimeType") {
                                value
                            }
                        }
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
