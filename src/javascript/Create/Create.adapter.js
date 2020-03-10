import {adaptSections} from '~/FormDefinitions/FormData.adapter';
import {getFields} from '~/EditPanel/EditPanel.utils';
import {resolveSelectorType} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

const getInitialValues = sections => {
    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    return getFields(sections).reduce((result, field) => ({...result, ...getFieldValues(field)}), {});
};

const getFieldValues = field => {
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (field.defaultValues && field.defaultValues.length > 0) {
        const mappedValues = field.defaultValues.map(defaultValue => {
            return defaultValue.string;
        });

        if (selectorType.adaptValue) {
            formFields[field.name] = selectorType.adaptValue(field, {
                value: mappedValues[0],
                notZonedDateValue: mappedValues[0],
                values: mappedValues,
                notZonedDateValues: mappedValues
            });
        } else {
            formFields[field.name] = field.multiple ? mappedValues : mappedValues[0];
        }
    } else if (selectorType && selectorType.initValue) {
        formFields[field.name] = selectorType.initValue(field);
    }

    return formFields;
};

export const adaptCreateFormData = (data, lang, t) => {
    const nodeData = data.jcr.result;
    const sections = data.forms.createForm.sections;

    return {
        sections: adaptSections(sections),
        initialValues: getInitialValues(sections),
        nodeData,
        details: {},
        technicalInfo: {},
        title: data.jcr.nodeTypeByName ?
            t('content-editor:label.contentEditor.create.title', {type: data.jcr.nodeTypeByName.displayName}) :
            nodeData.displayName
    };
};
