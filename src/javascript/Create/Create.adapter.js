import {adaptSections, getFieldValuesFromDefaultValues} from '~/FormDefinitions/FormData.adapter';
import {getFields} from '~/EditPanel/EditPanel.utils';
import {adaptSystemNameField} from '../FormDefinitions/FormData.adapter';
import {Constants} from '~/ContentEditor.constants';
import {encodeSystemName} from '~/utils';

// TODO https://jira.jahia.org/browse/TECH-300

const getInitialValues = (sections, nodeData) => {
    // Work in progress default value
    const wipInfo = {[Constants.wip.fieldName]: {status: nodeData.defaultWipInfo.status, languages: nodeData.defaultWipInfo.languages}};
    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    return {...getFields(sections).reduce((result, field) => ({...result, ...getFieldValuesFromDefaultValues(field)}), {}), ...wipInfo};
};

/**
 * This fct allow to adapt/modify the form data in create form
 * @param data Data from BackEnd
 * @param lang current lang
 * @param t translation fct
 * @param contentEditorConfigContext the editor config context
 */
export const adaptCreateFormData = (data, lang, t, contentEditorConfigContext) => {
    const nodeData = data.jcr.result;
    const sections = adaptSections(data.forms.createForm.sections);

    const formData = {
        sections: sections,
        initialValues: {
            ...getInitialValues(sections, nodeData)
        },
        hasPreview: false,
        nodeData,
        details: {},
        technicalInfo: [],
        title: t('content-editor:label.contentEditor.create.title', {type: data.jcr.nodeTypeByName.displayName}),
        nodeTypeDisplayName: data.jcr.nodeTypeByName.displayName,
        nodeTypeName: data.jcr.nodeTypeByName.name
    };

    adaptSystemNameField(data, formData, lang, t, data.jcr.nodeTypeByName, true, data.jcr.nodeTypeByName.moveSystemNameToTop, data.jcr.nodeTypeByName.isSystemNameReadOnlyMixin);

    if (contentEditorConfigContext.name) {
        formData.initialValues[Constants.systemName.name] = contentEditorConfigContext.name;
    }

    return formData;
};

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
