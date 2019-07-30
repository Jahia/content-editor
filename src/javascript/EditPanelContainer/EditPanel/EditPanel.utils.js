import EditPanelConstants from './EditPanelConstants';

export function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

export function getAllFields(sections, sectionName) {
    return sections.reduce((fields, section) => {
        let fieldSetsFields = [];
        if (!sectionName || sectionName === section.name) {
            fieldSetsFields = section.fieldSets.reduce((fieldSetsField, fieldset) => {
                return [...fieldSetsField, ...fieldset.fields];
            }, []);
        }

        return [...fields, ...fieldSetsFields];
    }, []);
}

export function getPropertiesToMutate(nodeData = {}, formValues = {}, sections, lang) {
    const keys = Object.keys(formValues).filter(key => !isSystemField(key));
    const allFields = sections && getAllFields(sections);
    const filteredFields = allFields && allFields.filter(field => !field.readOnly);

    let propsToSave = [];
    let propsToDelete = [];

    keys.forEach(key => {
        const field = filteredFields.find(field => field.name === key);

        if (field) {
            const value = formValues[key];
            if (value) {
                const fieldType = field.requiredType;

                const valueObj = {};

                if (field.multiple) {
                    valueObj.values = value;

                    if (fieldType === 'DATE') {
                        valueObj.notZonedDateValues = value;
                    }
                } else {
                    // In case we have field of type decimal or double, we should store number
                    // with a decimal point separator instead of decimal comma separator into JCR.
                    valueObj.value = fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;

                    if (fieldType === 'DATE') {
                        valueObj.notZonedDateValue = value;
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
