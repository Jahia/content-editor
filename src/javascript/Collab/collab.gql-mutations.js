import gql from 'graphql-tag';

export const DisconnectUserMutation = gql`
    mutation disconnectUser($nodePath:String!) {
        collaboration {
            disconnectUser(nodePath: $nodePath)
        }
    }
`;

export const PostMessage = gql`
    mutation postMessage($nodePath:String!, $message:String!) {
        collaboration {
            postMessage(nodePath: $nodePath, message: $message)
        }
    }
`;
