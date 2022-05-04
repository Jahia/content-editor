import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

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
                rename(name: $newName) @include(if: $shouldRename)
                removeMixins(mixins: $mixinsToDelete)
                addMixins(mixins: $mixinsToAdd)
                setPropertiesBatch(properties: $propertiesToSave) {
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
                }
                reorderChildren(names: $childrenOrder) @include(if: $shouldModifyChildren)
                node {
                    ...NodeCacheRequiredFields
                    path
                    displayableNode {
                        ...NodeCacheRequiredFields
                        path
                        isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                    }
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
