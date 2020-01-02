import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const ContentTableQuery = gql`
    query contentTableContent($path: String!, $language: String!, $typeFilter: [String]!, $recursionTypesFilter: [String]!, $fieldFilter: InputFieldFiltersInput) {
        jcr {
            result: nodeByPath(path: $path) {
                descendants(offset: 0, limit: 50,
                    typesFilter: {types: $typeFilter, multi: ANY},
                    recursionTypesFilter: {multi: NONE, types: $recursionTypesFilter},
                    fieldFilter: $fieldFilter) {

                    pageInfo {
                        totalCount
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
                        children(typesFilter: {types: $typeFilter, multi: ANY}) {
                            pageInfo {
                                totalCount
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
