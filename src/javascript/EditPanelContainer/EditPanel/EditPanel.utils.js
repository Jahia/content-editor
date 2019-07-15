import EditPanelConstants from './EditPanelConstants';

export function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

export function getPropertiesToMutate(nodeData = {}, formValues = {}, fields = [], lang) {
    const keys = Object.keys(formValues).filter(key => !isSystemField(key));
    const filteredFields = fields.filter(field => !field.formDefinition.readOnly);

    let propsToSave = [];
    let propsToDelete = [];

    keys.forEach(key => {
        const field = filteredFields.find(field => field.formDefinition && field.formDefinition.name === key);

        if (field) {
            const value = formValues[key];
            if (value) {
                const fieldType = field.jcrDefinition.requiredType;

                const valueObj = {};

                if (field.formDefinition.multiple) {
                    valueObj.values = value;

                    if (fieldType === 'DATE') {
                        valueObj.formattedDateValues = value;
                    }
                } else {
                    // In case we have field of type decimal or double, we should store number
                    // with a decimal point separator instead of decimal comma separator into JCR.
                    valueObj.value = fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;

                    if (fieldType === 'DATE') {
                        valueObj.formattedDateValue = value;
                    }
                }

                propsToSave.push({
                    name: key,
                    type: fieldType,
                    ...valueObj,
                    language: lang
                });
            } else {
                const nodeProperty = nodeData.properties.find(prop => prop.name === key);

                if (nodeProperty && (field.multiple ? nodeProperty.values : nodeProperty.value)) {
                    propsToDelete.push(key);
                }
            }
        }
    });

    return {
        propsToSave,
        propsToDelete
    };
}

export function encodeJCRPath(path) {
    return path.split('/').map(entry => encodeURIComponent(entry)).join('/');
}

export function extractRangeConstraints(constraint) {
    // Validate constraint
    if (!RegExp('[\\(\\[]+.*,.*[\\)\\]]').test(constraint)) {
        throw new Error(`unable to parse constraint ${constraint}`);
    }

    return {
        lowerBoundary: constraint.substring(1, constraint.lastIndexOf(',')).trim(),
        disableLowerBoundary: constraint.startsWith('('),
        upperBoundary: constraint.substring(constraint.lastIndexOf(',') + 1, constraint.length - 1).trim(),
        disableUpperBoundary: constraint.endsWith(')')
    };
}
