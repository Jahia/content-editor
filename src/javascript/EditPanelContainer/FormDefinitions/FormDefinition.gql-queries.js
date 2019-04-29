import gql from 'graphql-tag';

const FormQuery = gql`
    query getFormDefinition($nodeType:String!, $uiLang:String!, $lang:String!, $nodeIdOrPath:String ) {
        forms {
            form(nodeType: $nodeType, uiLocale: $uiLang, locale: $lang, nodeIdOrPath : $nodeIdOrPath) {
                nodeType
                fields {
                    name
                    selectorType
                    selectorOptions {
                        name
                        value
                    }
                    i18n
                    readOnly
                    multiple
                    mandatory
                    valueConstraints {
                        displayValue
                        value {
                            type
                            string
                        }
                        properties {
                            name
                            value
                        }
                    }
                    defaultValues {
                        type
                        string
                    }
                    targets {
                        name
                        rank
                    }
                    nodeType {
                        properties {
                            name
                            displayName(language: $lang)
                        }
                    }
                }
            }
        }
    }
`;

export {
    FormQuery
};
