import SelectorTypes from '../EditPanel/EditPanelContent/FormBuilder/SelectorTypes/SelectorTypes';
import dayjs from '../../date.config';

const isDetailField = field => field.readOnly && field.targets.find(target => target.name === 'metadata');

const getFields = (formDefinition, nodeData) => {
    return formDefinition.fields
        .filter(field => !isDetailField(field))
        .map(
            fieldDefinition => {
                return {
                    targets: fieldDefinition.targets,
                    formDefinition: fieldDefinition,
                    jcrDefinition: nodeData.primaryNodeType.properties.find(
                        prop => prop.name === fieldDefinition.name
                    ),
                    data: nodeData.properties.find(
                        prop => prop.name === fieldDefinition.name
                    )
                };
            }
        );
};

const getFieldValue = (formDefinition, fieldData) => {
    const selectorType = SelectorTypes.resolveSelectorType(formDefinition.selectorType, formDefinition.selectorOptions);
    if (selectorType) {
        if (selectorType.formatValue) {
            return selectorType.formatValue(fieldData);
        }

        if (selectorType.key === 'DateTimePicker' || selectorType.key === 'DatePicker') {
            return formDefinition.multiple ? fieldData.formattedDateValues : fieldData.formattedDateValue;
        }
    }

    return formDefinition.multiple ? fieldData.values : fieldData.value;
};

const getInitialValue = fields => {
    return fields.reduce(
        (initialValues, field) => {
            return {
                ...initialValues,
                [field.formDefinition.name]: field.data && getFieldValue(field.formDefinition, field.data)
            };
        },
        {}
    );
};

const getDetailsValue = (formDefinition, nodeData, lang) => {
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
};

export const adaptFormData = (data, lang, t) => {
    const formDefinition = data.forms.editForm;
    const nodeData = data.jcr.result;
    const fields = getFields(formDefinition, nodeData);

    return {
        nodeData,
        fields,
        initialValues: getInitialValue(fields),
        details: getDetailsValue(formDefinition, nodeData, lang),
        technicalInfo: getTechnicalInfo(nodeData, t)
    };
};
