import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const NodeDataFragment = {
    nodeData: {
        variables: {
            uilang: 'String!',
            language: 'String!',
            uuid: 'String!',
            writePermission: 'String!',
            childrenFilterTypes: '[String]!'
        },
        applyFor: 'node',
        gql: gql`fragment NodeData on JCRQuery {
            result:nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                lockedAndCannotBeEdited
                isSite: isNodeType(type: {multi: ANY, types: ["jnt:virtualsite"]})
                isPage: isNodeType(type: {multi: ANY, types: ["jnt:page"]})
                isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                isSystemNameReadOnlyMixin: isNodeType(type: {multi: ANY, types: ["jmix:systemNameReadonly"]})
                moveSystemNameToTop: isNodeType(type: {multi: ANY, types: [
                    "jnt:page",
                    "jnt:contentFolder",
                    "jnt:folder",
                    "jnt:file",
                    "jnt:category",
                    "jmix:mainResource"
                ]})
                displayableNode {
                    ...NodeCacheRequiredFields
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                translationLanguages
                name
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    ...NodeCacheRequiredFields
                    displayName(language: $language)
                    path
                }
                children(typesFilter:{types: $childrenFilterTypes}) {
                    nodes {
                        ...NodeCacheRequiredFields
                        name
                        displayName(language: $language)
                        primaryNodeType {
                            name
                            displayName(language: $language)
                            icon
                        }
                    }
                }
                primaryNodeType {
                    name
                    displayName(language: $uilang)
                    properties {
                        name
                        requiredType
                    }
                    supertypes {
                        name
                    }
                    hasOrderableChildNodes
                }
                properties(language: $language) {
                    name
                    value
                    notZonedDateValue
                    decryptedValue
                    values
                    notZonedDateValues
                    decryptedValues
                    definition {
                        declaringNodeType {
                            name
                        }
                    }
                }
                hasWritePermission: hasPermission(permissionName: $writePermission)
                hasPublishPermission: hasPermission(permissionName: "publish")
                hasStartPublicationWorkflowPermission: hasPermission(permissionName: "publication-start")
                lockInfo {
                    details(language: $language) {
                        owner
                        type
                    }
                }
                wipInfo{
                    status
                    languages
                }
                defaultWipInfo {
                    status
                    languages
                }
                usages: references(fieldFilter: {filters: {fieldName: "node.visible", value: "true"}}) {
                    nodes {
                        name
                        language
                        node {
                            ...NodeCacheRequiredFields
                            visible: isNodeType(type: {types: ["jnt:workflowTask"], multi: NONE})
                            displayName(language: $language)
                            path
                            primaryNodeType {
                                icon
                                name
                                displayName(language: $language)
                            }
                            aggregatedPublicationInfo(language: $language) {
                                publicationStatus
                            }
                            lastModifiedBy: property(name: "jcr:lastModifiedBy", language: $language) {
                                value
                            }
                            lastModified: property(name: "jcr:lastModified", language: $language) {
                                value
                            }
                            lastPublished: property(name: "j:lastPublished", language: $language) {
                                value
                            }
                            lastPublishedBy: property(name: "j:lastPublishedBy", language: $language) {
                                value
                            }
                            deletedBy: property(name: "j:deletionUser", language: $language) {
                                value
                            }
                            deleted: property(name: "j:deletionDate", language: $language) {
                                value
                            }
                            operationsSupport {
                                lock
                                markForDeletion
                                publication
                            }
                        }
                    }
                }
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`
    }
};

export const EditFormQuery = gql`
    query editForm($uilang:String!, $language:String!, $uuid: String!, $writePermission: String!, $childrenFilterTypes: [String]!) {
        forms {
            editForm(uiLocale: $uilang, locale: $language, uuidOrPath: $uuid) {
                name
                displayName
                description
                hasPreview
                sections {
                    name
                    displayName
                    description
                    hide
                    expanded
                    fieldSets {
                        name
                        displayName
                        description
                        dynamic
                        activated
                        displayed
                        readOnly
                        fields {
                            name
                            displayName
                            description
                            errorMessage
                            mandatory
                            i18n
                            multiple
                            readOnly
                            requiredType
                            selectorType
                            declaringNodeType
                            selectorOptions {
                                name
                                value
                                values
                            }
                            valueConstraints {
                                value {
                                    type
                                    string
                                }
                                displayValue
                                displayValueKey
                                properties {
                                    name
                                    value
                                }
                            }
                            defaultValues {
                                string
                            }
                        }
                    }
                }
            }
        }
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;
