import gql from 'graphql-tag';
import {NodeDataFragment} from '../NodeData/NodeData.gql-queries';

const FormQuery = gql`
    query editForm($uiLang:String!, $language:String!, $path: String!) {
        forms {
            editForm(uiLocale: $uiLang, locale: $language, nodePath : $path) {
                nodeType
                fields {
                    name
                    displayName
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
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;

export {
    FormQuery
};
