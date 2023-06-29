import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const OpenInTabActionQueryPath = gql`
    query openInTabActionQueryPath($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                site {
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const OpenInTabActionQueryUuid = gql`
    query openInTabActionQueryUuid($uuid: String!) {
        jcr {
            result: nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                site {
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
