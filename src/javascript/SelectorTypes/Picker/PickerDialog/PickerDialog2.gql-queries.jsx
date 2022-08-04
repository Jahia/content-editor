import gql from 'graphql-tag';

export const GET_PICKER_NODE = gql`query($paths: [String!]!, $lang:String!,$uilang:String!) {
    jcr {
        nodesByPath(paths:$paths) {
            workspace
            path
            uuid
            displayName(language:$lang)
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
}`;
