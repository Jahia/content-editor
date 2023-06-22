import {adaptSystemNameField} from './adaptSystemNameField';
import {getFields} from '~/utils/fields.utils';
import {Constants} from '~/ContentEditor.constants';
import {adaptSections, getExpandedSections} from '~/ContentEditor/adaptSections';
import {getFieldValuesFromDefaultValues} from '~/ContentEditor/getFieldValuesFromDefaultValues';
import {CreateFormQuery} from '~/ContentEditor/create.gql-queries';
import {useFormDefinition} from '~/ContentEditor/useFormDefinitions';

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
        sections,
        expandedSections: getExpandedSections(sections),
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

    adaptSystemNameField(data, formData, t, data.jcr.nodeTypeByName, true);

    if (contentEditorConfigContext.name) {
        formData.initialValues[Constants.systemName.name] = contentEditorConfigContext.name;
    }

    return formData;
};

export const useCreateFormDefinition = () => useFormDefinition(CreateFormQuery, adaptCreateFormData);
