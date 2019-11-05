import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const PublicationInfoQuery = gql`
    query getNodeProperties($path:String!, $language:String!) {
        jcr {
            nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                aggregatedPublicationInfo(language: $language, subNodes: false, references: false) {
                    publicationStatus
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

