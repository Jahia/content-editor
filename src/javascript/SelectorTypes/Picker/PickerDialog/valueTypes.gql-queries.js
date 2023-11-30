import {gql} from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const valueTypesQuery = gql`
    query valueTypesQuery($uuid: String!) {
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
