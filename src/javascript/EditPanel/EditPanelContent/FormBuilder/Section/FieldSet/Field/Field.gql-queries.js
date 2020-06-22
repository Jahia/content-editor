import gql from 'graphql-tag';

const FieldConstraints = gql`
    query fieldConstraints($uuid: String!, $nodeType: String!, $fieldName: String!, $uilang: String!, $language:String!) {
        forms {
            fieldConstraints(uuidOrPath: $uuid, nodeType: $nodeType, fieldName: $fieldName, uiLocale: $uilang, locale: $language) {
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
        }
    }
`;

export {
    FieldConstraints
};
