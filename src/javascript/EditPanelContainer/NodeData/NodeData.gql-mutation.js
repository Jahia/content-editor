import gql from 'graphql-tag';

export const SavePropertiesMutation = gql`
    mutation saveNodeProperties($path:String!, $properties:[InputJCRProperty]) {
        jcr {
            mutateNode(pathOrId: $path) {
                setPropertiesBatch(properties: $properties){
                    path
                }
            }
        }
    }
`;

export const PublishPropertiesMutation = gql`
    mutation saveNodeProperties($path:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $path) {
                publish(languages: $languages)
            }
        }
    }
`;
