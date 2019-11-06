import gql from 'graphql-tag';

export const getTreeOfContent = gql`
    query getTreeOfContent($nodeTypes:[String], $excludedNodeTypes:[String], $uiLang:String!, $path:String!){
        forms {
            contentTypesAsTree(nodeTypes:$nodeTypes,nodePath:$path, uiLocale:$uiLang, excludedNodeTypes:$excludedNodeTypes) {
                id
                name
                label
                iconURL
                children {
                    id
                    name
                    parent {
                        id
                        name
                    }
                    label
                    iconURL
                }
            }
        }
    }
`;
