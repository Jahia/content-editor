import gql from 'graphql-tag';

export const SavePropertiesMutation = gql`
    mutation saveNodeProperties(
        $uuid:String!,
        $propertiesToSave: [InputJCRProperty],
        $propertiesToDelete: [String],
        $mixinsToAdd: [String]!,
        $mixinsToDelete: [String]!,
        $language: String,
        $shouldModifyChildren: Boolean!,
        $childrenOrder: [String]!,
        $shouldRename: Boolean!,
        $newName: String!,
        $wipInfo: InputwipInfo!
    ) {
        jcr {
            mutateNode(pathOrId: $uuid) {
                addMixins(mixins: $mixinsToAdd)
                setPropertiesBatch(properties: $propertiesToSave) {
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
                }
                removeMixins(mixins: $mixinsToDelete)
                mutateWipInfo(wipInfo:$wipInfo)
                reorderChildren(names: $childrenOrder) @include(if: $shouldModifyChildren)
                rename(name: $newName) @include(if: $shouldRename)
            }
        }
    }
`;
