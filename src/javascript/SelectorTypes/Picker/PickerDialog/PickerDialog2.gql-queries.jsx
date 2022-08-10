import gql from 'graphql-tag';

export const GET_PICKER_NODE = gql`query($paths: [String!]!, $lang:String!,$uilang:String!) {
    jcr {
        nodesByPath(paths:$paths) {
            workspace
            path
            uuid
            displayName(language:$lang)
            operationsSupport {
                lock
                markForDeletion
                publication
            }
            aggregatedPublicationInfo(language: $lang) {
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
            children(names:["jcr:content"], typesFilter:{types:["jnt:resource"]}) {
                nodes {
                    uuid
                    workspace
                    data: property(name: "jcr:data") {
                        size
                    }
                }
            }
            site {
                uuid
                workspace
                path
            }
        }
    }
}`;
