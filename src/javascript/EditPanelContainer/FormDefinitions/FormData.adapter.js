/* TODO: BACKLOG-10772 fix/re-implement details panel
import dayjs from '../../date.config';
 */
import {getAllFields} from '../EditPanel/EditPanel.utils';
import {resolveSelectorType} from '../EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

/* TODO: BACKLOG-10772 fix/re-implement details panel
const isDetailField = field => field.readOnly && field.targets.find(target => target.name === 'metadata');
*/
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
    const allFields = getAllFields(sections);

    return allFields.reduce((initialValues, field) => {
        return {
            ...initialValues,
            [field.name]: getFieldValue(field)
        };
    }, {});
};

/* TODO: BACKLOG-10772 fix/re-implement details panel
const getDetailsValue = (formDefinition, nodeData, lang) => {
    return formDefinition.sections.fieldSets.fields
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
}; */

const getTechnicalInfo = (nodeData, t) => {
    return [
        {label: t('content-editor:label.contentEditor.details.contentType'), value: nodeData.primaryNodeType.displayName},
        {label: t('content-editor:label.contentEditor.details.mixinTypes'), value: nodeData.mixinTypes.map(m => m.name).join('; ')},
        {label: t('content-editor:label.contentEditor.details.path'), value: nodeData.path},
        {label: t('content-editor:label.contentEditor.details.uuid'), value: nodeData.uuid}
    ];
};

export const adaptFormData = (data, lang, t) => {
    /* TODO: BACKLOG-10772 fix/re-implement details panel
    const formDefinition = data.forms.editForm;
    */
    const nodeData = data.jcr.result;
    const sections = data.forms.editForm.sections;

    return {
        sections,
        initialValues: getInitialValues(sections),
        nodeData,
        details: [], // TODO: BACKLOG-10772 fix/re-implement details panel. getDetailsValue(formDefinition, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t)
    };
};
