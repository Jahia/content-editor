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
                isPage: isNodeType(type: {multi: ANY, types: ["jnt:page"]})
                isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                displayableNode {
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                name
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    displayName(language: $language)
                    path
                }
                children(typesFilter:{types: $childrenFilterTypes}) {
                    nodes {
                        name
                        displayName(language: $language)
                        primaryNodeType {
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
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}`
    }
};

const FormQuery = gql`
    query editForm($uilang:String!, $language:String!, $uuid: String!, $writePermission: String!, $childrenFilterTypes: [String]!) {
        forms {
            editForm(uiLocale: $uilang, locale: $language, uuidOrPath: $uuid) {
                name
                displayName
                description
                sections {
                    name
                    displayName
                    description
                    hide
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
                            selectorOptions {
                                name
                                value
                            }
                            valueConstraints {
                                value {
                                    type
                                    string
                                }
                                displayValue
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

const NodeQuery = gql`
    query getNodeProperties($uuid:String!, $language:String!, $uilang:String!, $writePermission: String!, $childrenFilterTypes: [String]!) {
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;

export {
    FormQuery,
    NodeQuery
};
