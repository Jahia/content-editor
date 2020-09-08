import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const FormQuery = gql`
    query createForm($uilang:String!, $language:String!, $uuid:String!, $primaryNodeType:String!) {
        forms {
            createForm(primaryNodeType: $primaryNodeType, uiLocale: $uilang, locale: $language, uuidOrPath: $uuid) {
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
            result:nodeById(uuid: $uuid) {
                ...NodeCacheRequiredFields
                newName: findAvailableNodeName(nodeType: $primaryNodeType, language: $language)
                lockedAndCannotBeEdited
                displayableNode {
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    displayName(language: $language)
                    path
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
                defaultWipInfo{
                    status
                    languages
                }
            }
            nodeTypeByName(name: $primaryNodeType) {
                name
                displayName(language: $uilang)
                moveSystemNameToTop: isNodeType(type: {multi: ANY, types: [
                    "jnt:page",
                    "jnt:contentFolder",
                    "jnt:folder",
                    "jnt:file",
                    "jnt:category",
                    "jmix:mainResource"
                ]})
            }
        }
       
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
