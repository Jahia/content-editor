import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const editFormQuery = gql`
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
