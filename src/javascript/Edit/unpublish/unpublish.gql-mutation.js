import gql from 'graphql-tag';

export const UnpublishNodeMutation = gql`
    mutation unpublishNode($path:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $path) {
                unpublish(languages: $languages)
            }
        }
    }
`;
