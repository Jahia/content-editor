import dayjs from '../../date.config';
import {getAllFields, getReducedFields} from '../EditPanel/EditPanel.utils';

const getInitialValues = (nodeData, sections) => {
    const allFields = getAllFields(sections);
    const allDynamicFieldSets = getAllFields(sections, true);

    const fields = getReducedFields(allFields, false, nodeData);
    const fieldSets = getReducedFields(allDynamicFieldSets, true, nodeData);

    return {...fields, ...fieldSets};
};

const getDetailsValue = (sections = [], nodeData, lang) => {
    const allFields = getAllFields(sections, false, 'metadata');

    if (!allFields) {
        return [];
    }

    return allFields
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

const adaptSections = sections => {
    const cloneSections = JSON.parse(JSON.stringify(sections));

    return cloneSections.reduce((result, section) => {
        if (section.name === 'metadata') {
            section.fieldSets = section.fieldSets.reduce((fieldSetsField, fieldSet) => {
                if (fieldSet.fields.find(f => f.readOnly)) {
                    return [...fieldSetsField];
                }

                return [...fieldSetsField, fieldSet];
            }, []);
        }

        return [...result, section];
    }, []);
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
