import {adaptSections, getFieldValuesFromDefaultValues} from '~/FormDefinitions/FormData.adapter';
import {getFields} from '~/EditPanel/EditPanel.utils';

const getInitialValues = sections => {
    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    return getFields(sections).reduce((result, field) => ({...result, ...getFieldValuesFromDefaultValues(field)}), {});
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
