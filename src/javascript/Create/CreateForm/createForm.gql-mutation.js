import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const CreateNode = gql`
    mutation createNode(
        $uuid: String!,
        $name: String!,
        $primaryNodeType: String!,
        $mixins: [String],
        $properties: [InputJCRProperty],
        $children: [InputJCRNode]
    ) {
        jcr {
            addNode(
                parentPathOrId: $uuid,
                name: $name,
                primaryNodeType: $primaryNodeType,
                mixins: $mixins,
                properties: $properties,
                children: $children,
                useAvailableNodeName: true
            ) {
                uuid
                node {
                    ...NodeCacheRequiredFields
                }
            }
            modifiedNodes {
                path
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
