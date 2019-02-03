import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const NodeQuery = gql`
    query getNodeProperties($path:String!, $language:String!) {
        jcr {
            result:nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                primaryNodeType { 
                    name
                    properties {
                        name
                        requiredType
                    }
                }
                properties(names: ["sharedSmallText", "sharedBigtext"]) {
                    name
                    value
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {
    NodeQuery
};
