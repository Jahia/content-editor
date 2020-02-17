import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const GetCategories = gql`
    query getCategories($path: String!, $language: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                displayName(language: $language)
                descendants(typesFilter: {types: ["jnt:category"]}) {
                    nodes {
                      ...NodeCacheRequiredFields
                      displayName(language: $language)
                      parent {
                        uuid
                      }
                    }
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}`;
