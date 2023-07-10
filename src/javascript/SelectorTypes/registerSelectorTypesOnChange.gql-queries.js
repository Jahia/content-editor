import gql from 'graphql-tag';

export const FieldConstraints = gql`
    query fieldConstraints($uuid: String, $parentUuid: String!, $primaryNodeType: String!, $nodeType: String!, $fieldName: String!, $context: [InputContextEntryInput], $uilang: String!, $language:String!) {
        forms {
            fieldConstraints(nodeUuidOrPath: $uuid, parentNodeUuidOrPath: $parentUuid, primaryNodeType: $primaryNodeType ,fieldNodeType: $nodeType, fieldName: $fieldName, context: $context, uiLocale: $uilang, locale: $language) {
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
        }
    }
`;
