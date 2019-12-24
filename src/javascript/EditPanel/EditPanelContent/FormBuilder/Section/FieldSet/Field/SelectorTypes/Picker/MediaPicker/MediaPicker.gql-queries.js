import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const MediaPickerFilledQuery = gql`
    query mediaPickerFilledQuery($uuid: String!, $needToFetch: Boolean!) {
        jcr @include(if: $needToFetch) {
            result: nodeById(uuid: $uuid) {
                name
                width: property(name: "j:width") {
                    value
                }
                height: property(name: "j:height") {
                    value
                }
                children(names: "jcr:content") {
                    nodes {
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
