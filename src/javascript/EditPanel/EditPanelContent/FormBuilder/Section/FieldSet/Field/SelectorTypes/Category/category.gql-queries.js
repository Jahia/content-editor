import gql from 'graphql-tag';

export const GetCategories = gql`
    query getCategories($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                displayName
                uuid
                descendants(typesFilter: {types: ["jnt:category"]}) {
                    nodes {
                      displayName
                      uuid
                      parent {
                        uuid
                      }
                    }
                }
            }
        }
    }
`;
