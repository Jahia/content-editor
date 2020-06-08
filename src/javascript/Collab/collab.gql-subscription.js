import gql from 'graphql-tag';

export const SubscribeToCollaboration = gql`
    subscription subscribeToCollaboration($nodePath:String!) {
        subscribeToCollaboration(nodePath: $nodePath) {
            users {
                userKey,
                userName,
                userPicture
            }
            messages {
                author,
                message
            }
            currentUser {
                userKey,
                userName,
                userPicture
            }
        }
    }
`;

