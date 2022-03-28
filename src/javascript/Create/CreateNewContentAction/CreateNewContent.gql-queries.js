import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const getTreeOfContentQuery = `forms {
            contentTypesAsTree(nodeTypes:$nodeTypes, childNodeName:$childNodeName, includeSubTypes:$includeSubTypes, nodePath:$path, uiLocale:$uilang, excludedNodeTypes:$excludedNodeTypes) {
                id
                name
                label
                iconURL
                nodeType {
                    name
                    mixin
                }
                children {
                    id
                    name
                    nodeType {
                        name
                        mixin
                    }
                    parent {
                        id
                        name
                    }
                    label
                    iconURL
                }
            }
        }`;

export const getTreeOfContentWithRequirements = gql`
    query getTreeOfContentWithRequirements($nodeTypes:[String], $childNodeName: String, $includeSubTypes: Boolean, $excludedNodeTypes:[String], $showOnNodeTypes:[String]!, $uilang:String!, $path:String!){
        ${getTreeOfContentQuery}
        jcr {
            nodeByPath(path: $path) {
                isNodeType(type: {types:$showOnNodeTypes})
                    ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const getTreeOfContent = gql`
    query getTreeOfContent($nodeTypes:[String], $childNodeName: String, $includeSubTypes: Boolean, $excludedNodeTypes:[String], $uilang:String!, $path:String!){
        ${getTreeOfContentQuery}
    }
`;
