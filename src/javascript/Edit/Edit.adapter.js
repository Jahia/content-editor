import dayjs from '~/date.config';
import {getDynamicFieldSets, getFields} from '~/EditPanel/EditPanel.utils';
import {resolveSelectorType} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';
import {adaptSections, getFieldValuesFromDefaultValues} from '~/FormDefinitions/FormData.adapter';
import {adaptSystemNameField} from '../FormDefinitions/FormData.adapter';

const getInitialValues = (nodeData, sections) => {
    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    const nodeValues = getFields(sections)
        .reduce((result, field) => ({...result, ...getFieldValues(field, nodeData)}), {});

    // Get default values for not enabled mixins
    const extendsMixinFieldsDefaultValues = getFields(sections, undefined, fieldset => fieldset.dynamic && !fieldset.activated)
        .reduce((result, field) => ({...result, ...getFieldValuesFromDefaultValues(field)}), {});

    const childrenOrderingFields = getChildrenOrderingFields(nodeData);

    // Return object contains fields and dynamic fieldSets
    return {...nodeValues, ...extendsMixinFieldsDefaultValues, ...dynamicFieldSets, ...childrenOrderingFields};
};

const getChildrenOrderingFields = nodeData => {
    if (!nodeData.isPage && nodeData.primaryNodeType.hasOrderableChildNodes) {
        return {
            // The name of this field contain :: because it's forbiden in JCR. With this we avoid collision :)
            'Children::Order': nodeData.children.nodes
        };
    }

    return {};
};

const getFieldValues = (field, nodeData) => {
    const property = nodeData.properties && nodeData.properties.find(prop => prop.name === field.name);
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (!property) {
        // Init value
        if (selectorType && selectorType.initValue) {
            formFields[field.name] = selectorType.initValue(field);
        }
    } else if (selectorType) {
        let adaptedPropertyValue;
        if (selectorType.adaptValue) {
            adaptedPropertyValue = selectorType.adaptValue(field, property);
        } else {
            adaptedPropertyValue = field.multiple ? property.values : property.value;
        }

        formFields[field.name] = adaptedPropertyValue;
    }

    return formFields;
};

const getDetailsValue = (sections = [], nodeData = {}, lang = 'en') => {
    // Retrieve only fields inside the metadata section
    const fields = getFields(sections, 'metadata');

    const fieldNamesToGet = ['j:lastPublished',
        'j:lastPublishedBy',
        'jcr:created',
        'jcr:createdBy',
        'jcr:lastModified',
        'jcr:lastModifiedBy'];

    if (!fields) {
        return [];
    }

    return fields
        .filter(field => fieldNamesToGet.indexOf(field.name) > -1)
        .map(field => {
            const jcrDefinition = nodeData.properties.find(
                prop => prop.name === field.name
            );

            if (field.selectorType.includes('Date')) {
                return {
                    label: field.displayName,
                    value: jcrDefinition &&
                        jcrDefinition.value &&
                        dayjs(jcrDefinition.value).locale(lang).format('L HH:mm')
                };
            }

            return {
                label: field.displayName,
                value: jcrDefinition && jcrDefinition.value
            };
        });
};

const getTechnicalInfo = (nodeData, t) => {
    return [
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.contentType'),
            value: nodeData.primaryNodeType.displayName
        },
        {
            label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.mixinTypes'), value: [
                nodeData.primaryNodeType.name,
                ...nodeData.mixinTypes.map(m => m.name)
            ].filter(v => v).join('; ')
        },
        {label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.path'), value: nodeData.path},
        {label: t('content-editor:label.contentEditor.edit.advancedOption.technicalInformation.uuid'), value: nodeData.uuid}
    ];
};

const editAdaptSystemNameField = (rawData, formData) => {
    // Set initial value for system name
    formData.initialValues['ce:systemName'] = rawData.jcr.result.name;
};

export const adaptEditFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = data.forms.editForm.sections;

    const formData = {
        sections: adaptSections(sections),
        initialValues: getInitialValues(nodeData, sections),
        nodeData,
        details: getDetailsValue(sections, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t),
        title: nodeData.displayName
    };

    adaptSystemNameField(data, formData, lang, t, nodeData.primaryNodeType, editAdaptSystemNameField);

    return formData;
};

/**
 * This fct allow to adapt/modify the save request data, before sending them to the server
 * @param nodeData Current node data
 * @param saveRequestVariables Current request variables
 * @returns {*}
 */
export const adaptSaveRequest = (nodeData, saveRequestVariables) => {
    saveRequestVariables.shouldRename = false;
    saveRequestVariables.newName = '';

    if (saveRequestVariables.propertiesToSave) {
        // Use system name to fill the save request variables.
        const systemNameIndex = saveRequestVariables.propertiesToSave.findIndex(property => property.name === 'ce:systemName');
        if (systemNameIndex > -1) {
            const newSystemName = saveRequestVariables.propertiesToSave[systemNameIndex].value;

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
