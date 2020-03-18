import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const PublicationInfoQuery = gql`
    query getNodeProperties($uuid:String!, $language:String!) {
        jcr {
            nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                aggregatedPublicationInfo(language: $language, subNodes: false, references: false) {
                    publicationStatus
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

