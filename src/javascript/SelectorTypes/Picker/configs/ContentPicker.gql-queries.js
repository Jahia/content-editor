import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const ContentPickerFilledQuery = gql`
    query contentPickerFilledQuery($uuid: String!, $language: String!, $needToFetch: Boolean!) {
        jcr @include(if: $needToFetch) {
            result: nodeById(uuid: $uuid) {
                displayName(language: $language)
                primaryNodeType {
                    name
                    displayName(language: $language)
                    icon
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
