import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const ContentDialogPickerQuery = gql`
    query pickerDialogQuery(
        $path: String!,
        $recursionTypesFilter: [String]!,
        $typeFilter: [String]!,
        $language: String!,
        $offset: Int!,
        $limit: Int!,

        $fieldFilter: InputFieldFiltersInput
    ) {
        jcr {
            result: nodeByPath(path: $path) {
                retrieveTotalCount: descendants(typesFilter: {types: $typeFilter, multi: ANY},
                            recursionTypesFilter: {multi: NONE, types: $recursionTypesFilter},
                            fieldFilter: $fieldFilter) {
                    pageInfo {
                        totalCount
                    }
                }

                descendants(
                    offset: $offset,
                    limit: $limit,
                    typesFilter: {types: $typeFilter, multi: ANY},
                    recursionTypesFilter: {multi: NONE, types: $recursionTypesFilter},
                    fieldFilter: $fieldFilter
                ) {
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
                        children(typesFilter: {types: $typeFilter, multi: ANY}) {
                            pageInfo {
                                totalCount
                            }
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
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const SearchContentDialogPickerQuery = gql`
    query searchPickerQuery(
        $path: String!,
        $language: String!,
        $searchTerms: String!,
        $searchName: String!,
        $searchSelectorType: String!,
        $offset: Int!,
        $limit: Int!
    ) {
        jcr {
            retrieveTotalCount: nodesByCriteria(
                criteria: {
                    language: $language,
                    nodeType: $searchSelectorType,
                    paths: [$path],
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
                }
            ) {
                pageInfo {
                    totalCount
                }
            }

            result: nodesByCriteria(
                criteria: {
                    language: $language,
                    nodeType: $searchSelectorType,
                    paths: [$path],
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
