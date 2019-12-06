import gql from 'graphql-tag';

export const UnpublishNodeMutation = gql`
    mutation unpublishNode($uuid:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $uuid) {
                unpublish(languages: $languages)
            }
        }
    }
`;
