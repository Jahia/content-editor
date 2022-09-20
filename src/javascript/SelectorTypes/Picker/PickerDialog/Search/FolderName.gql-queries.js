import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const FolderNameQuery = gql`
    query folderNameQuery($path: String!, $language: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                uuid
                workspace
                path
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
