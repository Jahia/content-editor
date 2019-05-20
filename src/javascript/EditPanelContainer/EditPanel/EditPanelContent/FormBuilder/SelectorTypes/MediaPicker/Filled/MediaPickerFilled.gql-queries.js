import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const MediaPickerFilledQuery = gql`
    query mediaPickerFilledQuery($uuid: String!) {
        jcr {
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
                ...NodeCacheRequiredFields
            }
        }
    }   
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {MediaPickerFilledQuery};
