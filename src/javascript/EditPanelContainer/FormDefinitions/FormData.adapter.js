import mockData from './form-mock.json';
import {resolveSelectorType} from '../EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

// Const isDetailField = field => field.readOnly && field.targets.find(target => target.name === 'metadata');

const getFieldValue = field => {
    const selectorType = resolveSelectorType(field);
    if (selectorType) {
        if (selectorType.formatValue) {
            return selectorType.formatValue(field.currentValues);
        }

        if (selectorType.key === 'DateTimePicker' || selectorType.key === 'DatePicker') {
            return field.multiple ? field.notZonedDateValues : field.notZonedDateValue;
        }
    }

    return field.multiple ? field.currentValues : (field.currentValues && field.currentValues[0].string);
};

const getInitialValues = sections => {
    const allFields = sections.reduce((fields, section) => {
        const fieldSetsFields = section.fieldSets.reduce((fieldSetsField, fieldset) => {
            return [...fieldSetsField, ...fieldset.fields];
        }, []);
        return [...fields, ...fieldSetsFields];
    }, []);

    return allFields.reduce((initialValues, field) => {
        return {
            ...initialValues,
            [field.name]: getFieldValue(field)
        };
    }, {});
};
// Todo : restore this code once BACKLOG-10733 is done
/*
Const getDetailsValue = (formDefinition, nodeData, lang) => {
    return formDefinition.fields
        .filter(isDetailField)
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
}; */

export const adaptFormData = data => {
    const nodeData = data.jcr.result;
    const sections = mockData.data.forms.editForm.sections;

    return {
        sections,
        initialValues: getInitialValues(sections),
        nodeData,
        details: {} /* getDetailsValue(formDefinition, nodeData, lang) */,
        technicalInfo: {} /* GetTechnicalInfo(nodeData, t) */
    };
};
