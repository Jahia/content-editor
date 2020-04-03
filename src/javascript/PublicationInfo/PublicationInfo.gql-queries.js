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
                lastModifiedBy:property(name:"jcr:lastModifiedBy"){
                    value
                }
                lastModified:property(name:"jcr:lastModified"){
                    value
                }
                lastPublishedBy:property(name:"j:lastPublishedBy"){
                    value
                }
                lastPublished:property(name:"j:lastPublished"){
                    value
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

