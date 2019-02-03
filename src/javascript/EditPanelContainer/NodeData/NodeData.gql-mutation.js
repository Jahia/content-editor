import gql from 'graphql-tag';

const SavePropertiesMutation = gql`
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

export {
    SavePropertiesMutation
};
