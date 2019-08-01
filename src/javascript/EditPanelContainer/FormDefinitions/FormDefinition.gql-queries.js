import gql from 'graphql-tag';
import {NodeDataFragment} from '../NodeData/NodeData.gql-queries';

export const FormQuery = gql`
    query editForm($uiLang:String!, $language:String!, $path: String!) {
        forms {
            editForm(uiLocale: $uiLang, locale: $language, nodePath : $path) {
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
                                    boolean
                                    double
                                    long
                                    string  
                                }
                                displayValue
                                properties {
                                    name
                                    value
                                }
                            }
                            defaultValues {
                                type
                                boolean
                                double
                                long
                                string
                            }
                            currentValues {
                                type
                                boolean
                                double
                                long
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
