import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const PreviewInTabActionQueryByPath = gql`
    query PreviewInTabActionQueryByPath($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                previewAvailable: isNodeType(type: {multi: ANY, types: ["jnt:page","jmix:mainResource"]})
                displayableNode {
                    ...NodeCacheRequiredFields
                    previewAvailable: isNodeType(type: {multi: ANY, types: ["jnt:page","jmix:mainResource"]})
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const PreviewInTabActionQueryByUuid = gql`
    query PreviewInTabActionQueryByUuid($uuid: String!) {
        jcr {
            result: nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                previewAvailable: isNodeType(type: {multi: ANY, types: ["jnt:page","jmix:mainResource"]})
                displayableNode {
                    ...NodeCacheRequiredFields
                    previewAvailable: isNodeType(type: {multi: ANY, types: ["jnt:page","jmix:mainResource"]})
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
