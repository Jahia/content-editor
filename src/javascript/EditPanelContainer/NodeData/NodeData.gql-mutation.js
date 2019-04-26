import gql from 'graphql-tag';

export const SavePropertiesMutation = gql`
    mutation saveNodeProperties($path:String!, $propertiesToSave:[InputJCRProperty], $propertiesToDelete: [String], $language: String) {
        jcr {
            mutateNode(pathOrId: $path) {
                setPropertiesBatch(properties: $propertiesToSave){
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
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

export const UnpublishPropertiesMutation = gql`
    mutation saveNodeProperties($path:String!, $languages: [String] ) {
        jcr {
            mutateNode(pathOrId: $path) {
                unpublish(languages: $languages)
            }
        }
    }
`;
