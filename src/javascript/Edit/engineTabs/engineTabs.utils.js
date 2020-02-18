import {registry} from '@jahia/ui-extender';
import openEngineTabs from './openEngineTabs.action';
import {Constants} from '~/ContentEditor.constants';
import {engineTabsPermissionCheckQuery} from './engineTabs.permission.gql-query';

/**
 * There is no test related to those functions as they are supposed to be deprecated soon.
 * Also as they are mostly related to external call (GWT) more of the logic is outside this code.
 */

const getNodeTypes = primaryNodeType => {
    let nodeTypes = primaryNodeType.supertypes.map(nodeType => nodeType.name);
    nodeTypes.unshift(primaryNodeType.name);
    return nodeTypes;
};

/**
 * This function open the edit engine tabs of to the node
 * that has been specified in the method parameters
 *
 * @param nodeData object contains node data
 * @param engineTabs array contains engine tabs id
 */
export function openEngineTab(nodeData, engineTabs) {
    const {path, displayName, uuid, mixinTypes, primaryNodeType} = nodeData;

    window.authoringApi.editContent(
        path,
        displayName,
        mixinTypes.map(mixinType => mixinType.name),
        getNodeTypes(primaryNodeType),
        uuid,
        false,
        {
            hideWip: true,
            displayedTabs: engineTabs,
            hideHeaders: true
        }
    );
}

/**
 * This function register the actions related to the GWT engine tabs
 *
 * @param nodeData the node data
 * @param site the current site key
 * @param client the apollo client
 */
export function registerEngineTabActions(nodeData, site, client) {
    const {path, displayName, uuid, mixinTypes, primaryNodeType} = nodeData;

    // SINCE DX 7.5 this fct is introduce, not usable by previous DX version
    if (!window.authoringApi.getEditTabs) {
        console.warn('DX version is not able to load GWT engine tabs in content editor');
        return;
    }

    // Get tabs from GWT authoring API
    let tabs = window.authoringApi.getEditTabs(
        path,
        uuid,
        displayName,
        mixinTypes.map(mixinType => mixinType.name),
        getNodeTypes(primaryNodeType),
        primaryNodeType.hasOrderableChildNodes
    );

    if (tabs && tabs.length > 0) {
        // Filter not supported tabs
        tabs = tabs.filter(tab => !Constants.notSupportedEngineTabs.includes(tab.id));

        // Permission check query
        client.query({
            query: engineTabsPermissionCheckQuery(tabs, site)
        }).then(result => {
            const actionPrefix = 'contentEditorGWTTabAction_';
            const actionStartPriority = 3;

            for (let i = 0; i < tabs.length; i++) {
                const tab = tabs[i];
                if (!registry.get(actionPrefix + tab.id) && (!tab.requiredPermission || result.data.jcr.nodeByPath[tab.id])) {
                    registry.addOrReplace('action', actionPrefix + tab.id, openEngineTabs, {
                        buttonLabel: tab.title,
                        targets: ['ContentEditorHeaderActions:' + (i + actionStartPriority)],
                        tabs: [tab.id]
                    });
                }
            }
        });
    }
}
