import gql from 'graphql-tag';

export const UnlockEditorMutation = gql`
    mutation unlockEditor($editorID:String!) {
        forms {
            unlockEditor(editorID: $editorID)
        }
    }
`;
