import dayjs from '../../date.config';
import {getFields, getDynamicFieldSets, getFieldValue} from '../EditPanel/EditPanel.utils';

const getInitialValues = (nodeData, sections) => {
    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    const fields = getFields(sections)
        .reduce((result, field) => ({...result, [field.name]: getFieldValue(field, nodeData)}), {});

    // Return object contains fields and dynamic fieldSets
    return {...fields, ...dynamicFieldSets};
};

const getDetailsValue = (sections = [], nodeData, lang) => {
    // Retrieve only fields inside the metadata section
    const fields = getFields(sections, 'metadata');

    if (!fields) {
        return [];
    }

    return fields
        .filter(field => field.readOnly)
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
        {label: t('content-editor:label.contentEditor.details.contentType'), value: nodeData.primaryNodeType.displayName},
        {label: t('content-editor:label.contentEditor.details.mixinTypes'), value: nodeData.mixinTypes.map(m => m.name).join('; ')},
        {label: t('content-editor:label.contentEditor.details.path'), value: nodeData.path},
        {label: t('content-editor:label.contentEditor.details.uuid'), value: nodeData.uuid}
    ];
};

export const adaptFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = data.forms.editForm.sections;

    return {
        sections,
        initialValues: getInitialValues(nodeData, sections),
        nodeData,
        details: getDetailsValue(sections, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t)
    };
};
