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
