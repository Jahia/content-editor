import dayjs from '~/date.config';
import {getDynamicFieldSets, getFields} from '~/EditPanel/EditPanel.utils';
import {resolveSelectorType} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';
import {adaptSections} from '~/FormDefinitions/FormData.adapter';

const getInitialValues = (nodeData, sections) => {
    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    const fields = getFields(sections)
        .reduce((result, field) => ({...result, ...getFieldValues(field, nodeData)}), {});

    const childrenOrderingFields = getChildrenOrderingFields(nodeData);

    // Return object contains fields and dynamic fieldSets
    return {...fields, ...dynamicFieldSets, ...childrenOrderingFields};
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

export const adaptEditFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = data.forms.editForm.sections;

    return {
        sections: adaptSections(sections),
        initialValues: getInitialValues(nodeData, sections),
        nodeData,
        details: getDetailsValue(sections, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t),
        title: data.jcr.nodeTypeByName ?
            t('content-editor:label.contentEditor.create.title', {type: data.jcr.nodeTypeByName.displayName}) :
            nodeData.displayName
    };
};
