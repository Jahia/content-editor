import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const ContentPickerFilledQuery = gql`
    query contentPickerFilledQuery($uuids: [String!]!, $language: String!) {
        jcr {
            result: nodesById(uuids: $uuids) {
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
