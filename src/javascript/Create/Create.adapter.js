import {adaptSections, getFieldValuesFromDefaultValues} from '~/FormDefinitions/FormData.adapter';
import {getFields} from '~/EditPanel/EditPanel.utils';
import {adaptSystemNameField} from '../FormDefinitions/FormData.adapter';
import {Constants} from '~/ContentEditor.constants';
import {encodeSystemName} from '~/utils';

const getInitialValues = (sections, nodeData) => {
    // Work in progress default value
    const wipInfo = {[Constants.wip.fieldName]: {status: nodeData.defaultWipInfo.status, languages: nodeData.defaultWipInfo.languages}};
    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    return {...getFields(sections).reduce((result, field) => ({...result, ...getFieldValuesFromDefaultValues(field)}), {}), ...wipInfo};
};

const adaptSystemName = (rawData, formData) => {
    // Set initial value for system name
    formData.initialValues['ce:systemName'] = rawData.jcr.result.newName;
};

/**
 * This fct allow to adapt/modify the form data in create form
 * @param data Data from BackEnd
 * @param lang current lang
 * @param t translation fct
 */
export const adaptCreateFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = data.forms.createForm.sections;

    const formData = {
        sections: adaptSections(sections),
        initialValues: {
            ...getInitialValues(sections, nodeData)
        },
        nodeData,
        details: {},
        technicalInfo: {},
        title: t('content-editor:label.contentEditor.create.title', {type: data.jcr.nodeTypeByName.displayName})
    };

    adaptSystemNameField(data, formData, lang, t, data.jcr.nodeTypeByName, adaptSystemName);

    return formData;
};

/**
 * This fct allow to adapt/modify the create request data, before sending them to the server
 * @param createRequestVariables Current request variables
 * @returns {*}
 */
export const adaptCreateRequest = createRequestVariables => {
    // Use system name to fill the create request variables.
    const systemNameIndex = createRequestVariables.properties.findIndex(property => property.name === 'ce:systemName');
    if (systemNameIndex > -1) {
        createRequestVariables.name = encodeSystemName(createRequestVariables.properties[systemNameIndex].value);

        // Remove ce:systemName prop
        createRequestVariables.properties.splice(systemNameIndex, 1);
    }

    return createRequestVariables;
};
