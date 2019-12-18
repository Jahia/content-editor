import gql from 'graphql-tag';

export const FolderNameQuery = gql`
    query folderNameQueryCoco($path: String!, $language: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                displayName(language: $language)
                uuid
                workspace
                path
            }
        }
    }
`;
