import gql from 'graphql-tag';
import {NodeDataFragment} from '~/NodeData/NodeData.gql-queries';

export const FormQuery = gql`
    query createForm($uilang:String!, $language:String!, $parentPath:String!, $path:String!, $primaryNodeType:String!) {
        forms {
            createForm(primaryNodeType: $primaryNodeType, uiLocale: $uilang, locale: $language, parentPath: $parentPath) {
                name
                displayName
                description
                sections {
                    name
                    displayName
                    description
                    fieldSets {
                        name
                        displayName
                        description
                        dynamic
                        activated
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
            nodeTypeByName(name: $primaryNodeType) {
                displayName(language: $uilang)
            }
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;
