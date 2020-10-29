import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

const visibleInContentTree = gql`
    fragment VisibleInContentTree on JCRNode {
        isVisibleInContentTree: isNodeType(type: {
            multi: ANY,
            types: [
                "jmix:visibleInContentTree",
                "jmix:cmContentTreeDisplayable",
                "jnt:contentFolder",
                "jnt:folder",
                "jnt:page"
            ]
        })
    }
`;

export const GetContentPath = gql`
    query getContentPath($path:String!, $language: String!) {
        jcr {
            node: nodeByPath(path:$path) {
                ...NodeCacheRequiredFields
                primaryNodeType {
                    name
                }
                displayName(language: $language)
                ...VisibleInContentTree
                ancestors(fieldFilter: {
                    filters: [
                        {evaluation: DIFFERENT, fieldName: "primaryNodeType.name", value: "rep:root"},
                        {evaluation: DIFFERENT, fieldName: "primaryNodeType.name", value: "jnt:virtualsitesFolder"},
                        {evaluation: DIFFERENT, fieldName: "primaryNodeType.name", value: "jnt:virtualsite"}
                    ]
                }) {
                    ...NodeCacheRequiredFields
                    displayName(language: $language)
                    primaryNodeType {
                        name
                    }
                    ...VisibleInContentTree
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
    ${visibleInContentTree}
`;
