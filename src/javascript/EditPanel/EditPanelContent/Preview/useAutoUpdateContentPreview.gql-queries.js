import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const AUTO_UPDATE_CONTENT_PREVIEW_MUTATION = gql`mutation previewQueryByWorkspace(
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
    $shouldSetWip: Boolean!,
    $templateType: String!, 
    $view: String!, 
    $contextConfiguration: String!, 
    $requestAttributes: [InputRenderRequestAttributeInput]) {
        jcr(save: false) {
            mutateNode(pathOrId: $uuid) {
                mutateWipInfo(wipInfo: $wipInfo) @include(if: $shouldSetWip)
            }
            node: mutateNode(pathOrId: $uuid) {
                addMixins(mixins: $mixinsToAdd)
                setPropertiesBatch(properties: $propertiesToSave) {
                    path
                }
                mutateProperties(names: $propertiesToDelete) {
                    delete(language: $language)
                }
                removeMixins(mixins: $mixinsToDelete)
                reorderChildren(names: $childrenOrder) @include(if: $shouldModifyChildren)
                rename(name: $newName) @include(if: $shouldRename)
                node {
                    id: uuid
                    isFile: isNodeType(type: {types: ["jnt:file"]})
                    path
                    lastModified: property(name: "jcr:lastModified", language: $language) {
                        value
                    }
                    renderedContent(templateType: $templateType, view: $view, contextConfiguration: $contextConfiguration, language: $language, requestAttributes: $requestAttributes) {
                        output
                        staticAssets(type: "css") {
                            key
                        }
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
}
${PredefinedFragments.nodeCacheRequiredFields.gql}`
