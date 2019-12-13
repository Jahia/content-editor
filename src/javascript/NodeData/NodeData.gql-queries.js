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
                displayableNode {
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
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
                    supertypes {
                        name
                    }
                    hasOrderableChildNodes
                }
                properties(language: $language) {
                    name
                    value
                    notZonedDateValue
                    values
                    notZonedDateValues
                }
                hasPublishPermission: hasPermission(permissionName: "publish")
                hasStartPublicationWorkflowPermission: hasPermission(permissionName: "publication-start")
                lockInfo {
                    details(language: $language) {
                        type
                    }
                }
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
