import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const MediaPickerFilledQuery = gql`
    query mediaPickerFilledQuery($uuids: [String!]!, $language: String!) {
        jcr {
            result: nodesById(uuids: $uuids) {
                displayName(language: $language)
                width: property(name: "j:width") {
                    value
                }
                height: property(name: "j:height") {
                    value
                }
                content: descendant(relPath: "jcr:content") {
                    ...NodeCacheRequiredFields
                    data: property(name: "jcr:data") {
                        size
                    }
                    mimeType: property(name: "jcr:mimeType") {
                        value
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
