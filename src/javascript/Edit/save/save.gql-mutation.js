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
        $wipInfo: InputwipInfo!,
        $shouldSetWip: Boolean!
    ) {
        jcr {
            mutateNode(pathOrId: $uuid) {
                mutateWipInfo(wipInfo:$wipInfo) @include(if: $shouldSetWip)
            }
            mutateNode(pathOrId: $uuid) {
                removeMixins(mixins: $mixinsToDelete)
                addMixins(mixins: $mixinsToAdd)
                setPropertiesBatch(properties: $propertiesToSave) {
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
                }
                reorderChildren(names: $childrenOrder) @include(if: $shouldModifyChildren)
                rename(name: $newName) @include(if: $shouldRename)
                node {
                    path
                    displayableNode {
                        path
                        isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                    }
                }
            }
        }
    }
`;
