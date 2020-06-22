import gql from 'graphql-tag';

export const FolderNameQuery = gql`
    query folderNameQuery($path: String!, $language: String!) {
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
