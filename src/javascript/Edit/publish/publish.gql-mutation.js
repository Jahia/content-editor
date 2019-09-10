import gql from 'graphql-tag';

export const PublishNodeMutation = gql`
    mutation publishNode($path:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $path) {
                publish(languages: $languages)
            }
        }
    }
`;
