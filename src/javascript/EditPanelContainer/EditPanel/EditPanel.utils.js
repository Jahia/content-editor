import EditPanelConstants from './EditPanelConstants';

export function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

export function getPropertiesToSave(formValues = {}, fields = [], lang) {
    const keys = Object.keys(formValues).filter(key => !isSystemField(key));
    const filteredFields = fields.filter(field => !field.formDefinition.readOnly);

    return keys.map(key => {
        let field = filteredFields.find(field => field.formDefinition && field.formDefinition.name === key);
        return field ? {
            name: key,
            type: field.jcrDefinition.requiredType,
            value: formValues[key],
            language: lang
        } : null;
    })
        .filter(Boolean);
}
