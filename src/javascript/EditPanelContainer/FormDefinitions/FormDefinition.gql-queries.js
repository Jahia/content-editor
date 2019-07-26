import gql from 'graphql-tag';
import {NodeDataFragment} from '../NodeData/NodeData.gql-queries';
// Todo: BACKLOG-10733 query to get the form definition
const FormQuery = gql`
    query editForm($uiLang:String!, $language:String!, $path: String!) {
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;

export {
    FormQuery
};
