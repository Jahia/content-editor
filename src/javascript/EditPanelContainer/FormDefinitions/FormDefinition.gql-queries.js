import gql from 'graphql-tag';

const FormQuery = gql`
    query getFormDefinition($nodeType:String!, $uiLang:String!, $nodeIdOrPath:String ) {
        forms {
            form(nodeType: $nodeType, locale: $uiLang, nodeIdOrPath : $nodeIdOrPath) {
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
                }
            }
        }
    }
`;

export {
    FormQuery
};
