import gql from 'graphql-tag';

export const DisconnectUserMutation = gql`
    mutation disconnectUser($nodePath:String!) {
        collaboration {
            disconnectUser(nodePath: $nodePath)
        }
    }
`;
