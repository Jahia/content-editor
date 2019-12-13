import {actionsRegistry} from '@jahia/react-material';
import openEngineTabs from './openEngineTabs.action';
import {Constants} from '~/ContentEditor.constants';

/**
 * This function open the edit engine tabs of to the node
 * that has been specified in the method parameters
 *
 * @param nodeData object contains node data
 * @param engineTabs array contains engine tabs id
 */
export function openEngineTab(nodeData, engineTabs) {
    const {path, displayName, uuid, mixinTypes, primaryNodeType} = nodeData;

    window.parent.authoringApi.editContent(
        path,
        displayName,
        mixinTypes.map(mixinType => mixinType.name),
        primaryNodeType.supertypes.map(nodeType => nodeType.name),
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
 * @param nodeData object contains node data
 */
export function registerEngineTabActions(nodeData) {
    const {path, displayName, uuid, mixinTypes, primaryNodeType} = nodeData;

    // SINCE DX 7.5 this fct is introduce, not usable by previous DX version
    if (!window.parent.authoringApi.getEditTabs) {
        console.warn('DX version is not able to load GWT engine tabs in content editor');
        return;
    }

    const tabs = window.parent.authoringApi.getEditTabs(
        path,
        uuid,
        displayName,
        mixinTypes.map(mixinType => mixinType.name),
        primaryNodeType.supertypes.map(nodeType => nodeType.name),
        primaryNodeType.hasOrderableChildNodes
    );

    const actionPrefix = 'contentEditorGWTTabAction_';
    const actionStartPriority = 3;

    if (tabs && tabs.length > 0) {
        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];

            if (!Constants.notSupportedEngineTabs.includes(tab) && !actionsRegistry.get(actionPrefix + tab)) {
                actionsRegistry.add(actionPrefix + tab, openEngineTabs, {
                    buttonLabel: tab,
                    target: ['ContentEditorHeaderActions:' + (i + actionStartPriority)],
                    tabs: [tab]
                });
            }
        }
    }
}
