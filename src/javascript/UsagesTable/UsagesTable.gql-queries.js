import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const UsagesQuery = gql`query($path:String!, $language: String!, $pageSize: Int!, $currentPage: Int!, $fieldSorter: InputFieldSorterInput) {
    jcr {
        nodeByPath(path: $path) {
            ...NodeCacheRequiredFields
            usages: usages(fieldFilter: {filters: {fieldName: "node.visible", value: "true"}}, limit: $pageSize, offset: $currentPage, fieldSorter: $fieldSorter) {
                nodes {
                    properties {
                        name
                        language
                    }
                    node {
                        ...NodeCacheRequiredFields
                        visible: isNodeType(type: {types: ["jnt:workflowTask"], multi: NONE})
                        displayName(language: $language)
                        path
                        primaryNodeType {
                            icon
                            name
                            displayName(language: $language)
                        }
                        aggregatedPublicationInfo(language: $language) {
                            publicationStatus
                        }
                        lastModifiedBy: property(name: "jcr:lastModifiedBy", language: $language) {
                            value
                        }
                        lastModified: property(name: "jcr:lastModified", language: $language) {
                            value
                        }
                        lastPublished: property(name: "j:lastPublished", language: $language) {
                            value
                        }
                        lastPublishedBy: property(name: "j:lastPublishedBy", language: $language) {
                            value
                        }
                        deletedBy: property(name: "j:deletionUser", language: $language) {
                            value
                        }
                        deleted: property(name: "j:deletionDate", language: $language) {
                            value
                        }
                        operationsSupport {
                            lock
                            markForDeletion
                            publication
                        }
                    }
                }
                pageInfo {
                    totalCount
                }
            }
        }
    }
}
${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const UsagesCountQuery = gql`query($path:String!) {
    jcr {
        nodeByPath(path: $path) {
            ...NodeCacheRequiredFields
            usages: references(fieldFilter: {filters: {fieldName: "node.visible", value: "true"}}) {
                nodes {
                    node {
                        ...NodeCacheRequiredFields
                        visible: isNodeType(type: {types: ["jnt:workflowTask"], multi: NONE})
                    }
                }
                pageInfo {
                    nodesCount
                }
            }
        }
    }
}
${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
