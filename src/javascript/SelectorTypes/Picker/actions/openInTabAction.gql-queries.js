import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const OpenInTabActionQuery = gql`
    query OpenInTabActionQuery($path: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {OpenInTabActionQuery};
