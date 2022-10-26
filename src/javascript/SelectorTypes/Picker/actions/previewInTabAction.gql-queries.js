import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const PreviewInTabActionQuery = gql`
    query mediaPickerFilledQuery($path: String!) {
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

export {PreviewInTabActionQuery};
