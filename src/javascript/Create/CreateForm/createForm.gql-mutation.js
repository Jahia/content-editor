import gql from 'graphql-tag';

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
            }
            modifiedNodes {
                path
            }
        }
    }
`;
