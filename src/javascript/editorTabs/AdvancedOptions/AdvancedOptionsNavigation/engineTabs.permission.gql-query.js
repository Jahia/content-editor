import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const engineTabsPermissionCheckQuery = (tabs, site) => {
    // Build permission check query
    let tabsPermissionCheckFields = '';

    tabs.forEach(tab => {
        if (tab.requiredPermission) {
            tabsPermissionCheckFields += `\n${tab.id}:hasPermission(permissionName:"${tab.requiredPermission}")`;
        }
    });

    return gql`
        query tabsPermissionCheck {
            jcr {
                nodeByPath(path: "/sites/${site}") {
                    ...NodeCacheRequiredFields
                    ${tabsPermissionCheckFields}
                }
            }
        }
        ${PredefinedFragments.nodeCacheRequiredFields.gql}
    `;
};
