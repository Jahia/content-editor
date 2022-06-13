import {Constants} from '~/ContentEditor.constants';
import {encodeSystemName} from '~/utils';

/**
 * This fct allow to adapt/modify the create request data, before sending them to the server
 * @param createRequestVariables Current request variables
 * @returns {*}
 */
export const adaptCreateRequest = createRequestVariables => {
    // Use system name to fill the create request variables.
    const systemNameIndex = createRequestVariables.properties.findIndex(property => property.name === Constants.systemName.propertyName);
    if (systemNameIndex > -1) {
        createRequestVariables.name = encodeSystemName(createRequestVariables.properties[systemNameIndex].value);

        // Remove ce:systemName prop
        createRequestVariables.properties.splice(systemNameIndex, 1);
    }

    return createRequestVariables;
};
