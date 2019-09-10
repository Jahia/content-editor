import gql from 'graphql-tag';

export const CreateNode = gql`
    mutation createNode(
        $parentPathOrId: String!,
        $name: String!,
        $primaryNodeType: String!,
        $mixins: [String],
        $properties: [InputJCRProperty],
        $children: [InputJCRNode]
    ) {
        jcr {
            addNode(
                parentPathOrId: $parentPathOrId,
                name: $name,
                primaryNodeType: $primaryNodeType,
                mixins: $mixins,
                properties: $properties,
                children: $children
            ) {
                uuid
            }
        }
    }
`;
