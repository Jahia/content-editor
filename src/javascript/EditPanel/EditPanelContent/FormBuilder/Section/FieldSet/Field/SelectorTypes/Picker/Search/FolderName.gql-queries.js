import gql from 'graphql-tag';

export const FolderNameQuery = gql`
    query folderNameQueryCoco($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                displayName
                uuid
                workspace
                path
            }
        }
    }
`;
