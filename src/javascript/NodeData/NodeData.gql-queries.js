import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const NodeDataFragment = {
    nodeData: {
        variables: {
            uilang: 'String!',
            language: 'String!',
            uuid: 'String!',
            writePermission: 'String!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeData on JCRQuery {
            result:nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                lockedAndCannotBeEdited
                isPage: isNodeType(type: {multi: ANY, types: ["jnt:page"]})
                isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                displayableNode {
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                name
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    displayName(language: $language)
                    path
                }
                children {
                    nodes {
                        name
                        primaryNodeType {
                            displayName(language: $language)
                            icon
                        }
                    }
                }
                primaryNodeType {
                    name
                    displayName(language: $uilang)
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
                hasWritePermission: hasPermission(permissionName: $writePermission)
                hasPublishPermission: hasPermission(permissionName: "publish")
                hasStartPublicationWorkflowPermission: hasPermission(permissionName: "publication-start")
                lockInfo {
                    details(language: $language) {
                        owner
                        type
                    }
                }
                wipInfo{
                    status
                    languages
                }
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`
    }
};

const NodeQuery = gql`
    query getNodeProperties($uuid:String!, $language:String!, $uilang:String!) {
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
