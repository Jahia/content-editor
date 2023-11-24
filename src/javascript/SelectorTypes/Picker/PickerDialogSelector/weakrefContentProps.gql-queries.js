import {gql} from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const weakrefContentPropsQuery = gql`
    query weakrefContentPropsQuery($uuid: String!) {
        jcr{
            result: nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                primaryNodeType {
                    name
                    supertypes{name}
                }
                mixinTypes {name}
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
