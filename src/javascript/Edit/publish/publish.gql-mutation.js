import gql from 'graphql-tag';

export const PublishNodeMutation = gql`
    mutation publishNode($uuid:String!, $language: String!) {
        forms {
            publishForm(uuidOrPath: $uuid, locale: $language)
        }
    }
`;
