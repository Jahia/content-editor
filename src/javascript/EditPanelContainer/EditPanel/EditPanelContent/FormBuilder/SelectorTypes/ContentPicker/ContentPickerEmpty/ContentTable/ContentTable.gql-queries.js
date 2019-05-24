import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const ContentTableQuery = gql`
    query contentTableContent($path: String!, $language: String!, $typeFilter: [String]!, $recursionTypesFilter: [String]!) {
        jcr {
            result: nodeByPath(path: $path) {
                descendants(offset: 0, limit: 50, typesFilter: {types: $typeFilter, multi: ANY}, recursionTypesFilter: {multi: NONE, types: $recursionTypesFilter}) {
                    pageInfo {
                        totalCount
                    }
                    nodes {
                        displayName(language: $language)
                        primaryNodeType {
                            typeName: displayName(language: $language)
                            icon
                        }
                        createdBy: property(name: "jcr:createdBy") {
                            value
                        }
                        lastModified: property(name: "jcr:lastModified") {
                            value
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

export {ContentTableQuery};
