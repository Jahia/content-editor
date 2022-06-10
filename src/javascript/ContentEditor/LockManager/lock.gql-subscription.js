import gql from 'graphql-tag';

export const SubscribeToEditorLock = gql`
    subscription subscribeToEditorLock($nodeId:String!, $editorID:String!) {
        subscribeToEditorLock(nodeId: $nodeId, editorID: $editorID)
    }
`;

