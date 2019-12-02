import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

const SiteNodesQuery = gql`
    query SiteNodes($query: String!, $displayLanguage:String!) {
        jcr {
            result:nodesByQuery(query: $query) {
                siteNodes:nodes {
                    name
                    hasPermission(permissionName: "contentManager")
                    displayName(language: $displayLanguage)
                    site {
                        defaultLanguage
                        languages {
                            displayName
                            language
                            activeInEdit
                        }
                        ...NodeCacheRequiredFields
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export {SiteNodesQuery};
