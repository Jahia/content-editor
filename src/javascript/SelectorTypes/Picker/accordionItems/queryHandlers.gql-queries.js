import gql from 'graphql-tag';

export const UserPickerFragment = {
    gql: gql`
        fragment UserPickerFragment on JCRNode {
            siteInfo: site {
                ...NodeCacheRequiredFields
                displayName(language: $language)
            }
            userFolderAncestors: ancestors(fieldFilter: {filters: {fieldName: "primaryNodeType.name", value: "jnt:usersFolder", evaluation: EQUAL}}) {
                ...NodeCacheRequiredFields
                name
                primaryNodeType {
                    name
                }
            }
        }
    `,
    applyFor: 'node'
};

