import gql from 'graphql-tag';

const FormQuery = gql`
    query getFormDefinition($nodeType:String!, $uiLang:String!, $nodeId:String ) {
        forms {
            formByNodeType(nodeType: $nodeType, locale: $uiLang, nodeId : $nodeId) {
                nodeType
                fields {
                    name
                    fieldType
                    i18n
                    readOnly
                    multiple
                    mandatory
                    values
                    defaultValue
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
