import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const GetCategories = gql`
    query getCategories($path: String!, $language: String!) {
        jcr {
            result: nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                value: uuid
                label: displayName(language: $language)
                descendants(typesFilter: {types: ["jnt:category"]}) {
                    nodes {
                      ...NodeCacheRequiredFields
                      value: uuid
                      label: displayName(language: $language)
                      parent {
                        ...NodeCacheRequiredFields
                        uuid
                      }
                    }
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}`;
