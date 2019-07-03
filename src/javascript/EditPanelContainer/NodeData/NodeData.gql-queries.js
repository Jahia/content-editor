import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const NodeDataFragment = {
    nodeData: {
        variables: {
            uiLang: 'String!',
            language: 'String!',
            path: 'String!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeData on JCRQuery {
            result:nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    displayName(language: $language)
                    path
                }

                primaryNodeType {
                    name
                    displayName(language: $uiLang)
                    properties {
                        name
                        requiredType
                    }
                }
                properties(language: $language) {
                    name
                    value
                    values
                }
                aggregatedPublicationInfo(language: $language, subNodes: false, references: false) {
                    publicationStatus
                }
                hasPermission(permissionName: "publish")
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`
    }
};

const NodeQuery = gql`
    query getNodeProperties($path:String!, $language:String!, $uiLang:String!) {
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;

export {
    NodeQuery,
    NodeDataFragment
};
