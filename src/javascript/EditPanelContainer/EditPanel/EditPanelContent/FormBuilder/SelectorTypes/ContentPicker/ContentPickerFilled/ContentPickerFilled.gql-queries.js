import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const ContentPickerFilledQuery = gql`
    query contentPickerFilledQuery($uuid: String!, $language: String!) {
        jcr {
            result: nodeById(uuid: $uuid) {
                displayName(language: $language)
                primaryNodeType {
                    displayName(language: $language)
                    icon
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
