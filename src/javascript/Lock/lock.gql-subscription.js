import gql from 'graphql-tag';

export const SubscribeToEditorLock = gql`
    subscription subscribeToEditorLock($nodePath:String!, $editorID:String!) {
        subscribeToEditorLock(nodePath: $nodePath, editorID: $editorID) {
            heartbeat
        }
    }
`;

