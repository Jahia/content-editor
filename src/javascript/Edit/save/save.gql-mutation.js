import gql from 'graphql-tag';

export const SavePropertiesMutation = gql`
    mutation saveNodeProperties($path:String!, $propertiesToSave: [InputJCRProperty], $propertiesToDelete: [String], $mixinsToAdd: [String]!, $mixinsToDelete: [String]!, $language: String) {
        jcr {
            mutateNode(pathOrId: $path) {
                addMixins(mixins: $mixinsToAdd)
                setPropertiesBatch(properties: $propertiesToSave) {
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
                }
                removeMixins(mixins: $mixinsToDelete)
            }
        }
    }
`;
