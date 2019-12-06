import gql from 'graphql-tag';

export const PublishNodeMutation = gql`
    mutation publishNode($uuid:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $uuid) {
                publish(languages: $languages)
            }
        }
    }
`;
