import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const MediaPickerImages = gql`
    query mediaPickerImages($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                children(offset: 0, limit: 50, typesFilter: {types: ["jmix:image"], multi: ANY}) {
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
                        lastModified: property(name: "jcr:lastModified") {
                            value
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
