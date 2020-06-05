import gql from 'graphql-tag';

export const SubscribeToCollaboration = gql`
    subscription subscribeToCollaboration($nodePath:String!) {
        subscribeToCollaboration(nodePath: $nodePath) {
            users {
                userKey,
                userName,
                userPicture
            }
        }
    }
`;

