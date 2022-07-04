import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const MediaPickerFilledQuery = gql`
    query mediaPickerFilledQuery($uuid: String!, $language: String!, $needToFetch: Boolean!) {
        jcr @include(if: $needToFetch) {
            result: nodeById(uuid: $uuid) {
                displayName(language: $language)
                width: property(name: "j:width") {
                    value
                }
                height: property(name: "j:height") {
                    value
                }
                children(names: "jcr:content") {
                    nodes {
                        ...NodeCacheRequiredFields
                        mimeType: property(name: "jcr:mimeType") {
                            value
                        }
                    }
                }
                lastModified: property(name: "jcr:lastModified") {
                    value
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {MediaPickerFilledQuery};
