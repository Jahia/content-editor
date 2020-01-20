import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const searchPickerQuery = gql`
    query searchPickerQuery(
        $path: String!,
        $language: String!,
        $searchTerms: String!,
        $searchName: String!,
        $searchSelectorType: String!
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
                offset: 0,
                limit: 50
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
                    width: property(name: "j:width") {
                        value
                    }
                    height: property(name: "j:height") {
                        value
                    }
                    children(names: ["jcr:content"]) {
                        nodes {
                            mimeType: property(name: "jcr:mimeType") {
                                value
                            }
                        }
                    }
                    isDisplayableNode
                    lastModified: property(name: "jcr:lastModified") {
                        value
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
