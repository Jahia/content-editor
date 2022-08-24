import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const GET_PICKER_NODE = gql`
    query getSelectedNodesInformation($paths: [String!]!, $language:String!,$uilang:String!) {
        jcr {
            nodesByPath(paths:$paths) {
                displayName(language:$language)
                operationsSupport {
                    lock
                    markForDeletion
                    publication
                }
                aggregatedPublicationInfo(language: $language) {
                    publicationStatus
                }
                primaryNodeType {
                    name
                    displayName(language: $uilang)
                    icon
                }
                ancestors {
                    workspace
                    path
                    uuid
                    primaryNodeType {
                        name
                    }
                }
                site {
                    uuid
                    workspace
                    path
                }
                ...NodeCacheRequiredFields
                ...node
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const GET_SEARCH_CONTEXT = gql`
    query getSearchContext($paths: [String!]!, $language:String!,$uilang:String!) {
        jcr {
            nodesByPath(paths:$paths) {
                workspace
                path
                uuid
                displayName(language:$language)
                primaryNodeType {
                    name
                    displayName(language: $uilang)
                    icon
                }
                ancestors {
                    workspace
                    path
                    uuid
                    primaryNodeType {
                        name
                    }
                }
            }
        }
    }
`;
