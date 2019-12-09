import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/apollo-dx';

export const builSearchQuery = typeFilter => {
    return gql`
    query searchPickerQuery(
        $path: String!,
        $language: String!,
        $searchTerms: String!
    ) {
        jcr {
            result: nodesByCriteria(
                criteria: {
                    language: $language,
                    nodeType: "jmix:searchable",
                    paths: [$path],
                    nodeConstraint: {
                        any: [
                            {contains: $searchTerms}
                            {contains: $searchTerms, property: "j:tagList"}
                            {contains: $searchTerms, property: "j:nodename"}
                            ${typeFilter.map(type => `{contains: "${type}", property: "jcr:primaryType"}`).join(',')}
                        ]
                    }
                },
                offset: 0,
                limit: 50
            ) {
                pageInfo {
                    totalCount
                }
                nodes {
                    displayName(language: $language)
                    name
                    primaryNodeType {
                        typeName: displayName(language: $language)
                        icon
                    }
                    createdBy: property(name: "jcr:createdBy") {
                        value
                    }
                    width: property(name: "j:width") {
                        value
                    }
                    height: property(name: "j:height") {
                        value
                    }
                    children(names: ["jcr:content"]) {
                        nodes {
                            mimeType: property(name: "jcr:mimeType") {
                                value
                            }
                        }
                    }
                    isDisplayableNode
                    lastModified: property(name: "jcr:lastModified") {
                        value
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
};
