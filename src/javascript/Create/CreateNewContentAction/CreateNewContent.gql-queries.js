import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const getTreeOfContentQuery = `forms {
            contentTypesAsTree(nodeTypes:$nodeTypes,nodePath:$path, uiLocale:$uiLang, excludedNodeTypes:$excludedNodeTypes) {
                id
                name
                label
                iconURL
                nodeType {
                    mixin
                }
                children {
                    id
                    name
                    nodeType {
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
    query getTreeOfContent($nodeTypes:[String], $excludedNodeTypes:[String], $showOnNodeTypes:[String]!, $uiLang:String!, $path:String!){
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
    query getTreeOfContent($nodeTypes:[String], $excludedNodeTypes:[String], $uiLang:String!, $path:String!){
        ${getTreeOfContentQuery}
    }
`;
