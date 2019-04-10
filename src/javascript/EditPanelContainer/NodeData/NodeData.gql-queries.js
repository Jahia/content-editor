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
                properties(language: $language) {
                    name
                    value
                    values
                }
                aggregatedPublicationInfo(language: $language, subNodes: false, references: false) {
                    publicationStatus
                }
                hasPermission(permissionName: "publish")
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {
    NodeQuery
};
