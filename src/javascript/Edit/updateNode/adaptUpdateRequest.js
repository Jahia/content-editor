import {Constants} from '~/ContentEditor.constants';
import {encodeSystemName} from '~/utils';

/**
 * This fct allow to adapt/modify the save request data, before sending them to the server
 * @param nodeData Current node data
 * @param saveRequestVariables Current request variables
 * @returns {*}
 */
export const adaptUpdateRequest = (nodeData, saveRequestVariables) => {
    saveRequestVariables.shouldRename = false;
    saveRequestVariables.newName = '';
    saveRequestVariables.shouldSetWip = Constants.wip.notAvailableFor.indexOf(nodeData.primaryNodeType.name) === -1;

    if (saveRequestVariables.propertiesToSave) {
        // Use system name to fill the save request variables.
        const systemNameIndex = saveRequestVariables.propertiesToSave.findIndex(property => property.name === Constants.systemName.propertyName);
        if (systemNameIndex > -1) {
            const newSystemName = encodeSystemName(saveRequestVariables.propertiesToSave[systemNameIndex].value);

            if (newSystemName !== nodeData.name) {
                saveRequestVariables.shouldRename = true;
                saveRequestVariables.newName = newSystemName;
            }

            // Remove ce:systemName prop
            saveRequestVariables.propertiesToSave.splice(systemNameIndex, 1);
        }
    }

    return saveRequestVariables;
};
