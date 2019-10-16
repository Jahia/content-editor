import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const MediaPickerImages = gql`
    query mediaPickerImages($path: String!, $typeFilter: [String]!) {
        jcr {
            result: nodeByPath(path: $path) {
                children(offset: 0, limit: 50, typesFilter: {types: $typeFilter, multi: ANY}) {
                    pageInfo {
                        totalCount
                    }
                    nodes {
                        width: property(name: "j:width") {
                            value
                        }
                        height: property(name: "j:height") {
                            value
                        }
                        name
                        children(names: ["jcr:content"]) {
                            nodes {
                                mimeType: property(name: "jcr:mimeType") {
                                    value
                                }
                            }
                        }
                        ...NodeCacheRequiredFields
                    }
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {MediaPickerImages};
