import EditPanelConstants from './EditPanelConstants';
import {resolveSelectorType} from './EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

export function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

export function getAllFields(sections, isDynamicFieldSets, sectionName) {
    return sections.reduce((fields, section) => {
        let fieldSetsFields = [];
        if (!sectionName || sectionName === section.name) {
            fieldSetsFields = section.fieldSets
                .filter(filedSet => !isDynamicFieldSets || (isDynamicFieldSets && filedSet.dynamic))
                .reduce((fieldSetsField, fieldset) => {
                    return isDynamicFieldSets ?
                        [...fieldSetsField, fieldset] :
                        [...fieldSetsField, ...fieldset.fields];
                }, []);
        }

        return [...fields, ...fieldSetsFields];
    }, []);
}

export function getDataToMutate(nodeData = {}, formValues = {}, sections, lang) {
    const keys = Object.keys(formValues).filter(key => !isSystemField(key));
    const allFields = sections && getAllFields(sections);
    const filteredFields = allFields && allFields.filter(field => !field.readOnly);

    const mixinsToMutate = getMixinsToMutate(nodeData, formValues, sections);

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

    mixinsToMutate.mixinsToDelete.forEach(mixin => {
        const fieldsToDelete = sections
            .map(section => section.fieldSets.find(fieldSet => fieldSet.name === mixin))
            .reduce((result, fieldSet) => {
                if (fieldSet) {
                    return {...result, ...fieldSet};
                }

                return {...result};
            }, {})
            .fields;

        fieldsToDelete.map(field => propsToDelete.push(field.name));
    });

    return {
        propsToSave,
        propsToDelete,
        mixinsToAdd: mixinsToMutate.mixinsToAdd,
        mixinsToDelete: mixinsToMutate.mixinsToDelete
    };
}

export function getReducedFields(allFields = [], isDynamicFieldSets, nodeData) {
    return allFields.reduce((initialValues, field) => {
        return {
            ...initialValues,
            [field.name]: isDynamicFieldSets ? field.activated : getFieldValue(field, nodeData)
        };
    }, {});
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

function getMixinsToMutate(nodeData = {}, formValues = {}, sections) {
    let mixinsToAdd = [];
    let mixinsToDelete = [];

    const allDynamicFieldSets = getAllFields(sections, true);
    const reducedFieldSets = getReducedFields(allDynamicFieldSets, true, nodeData);
    const fieldSets = Object.keys(reducedFieldSets).map(key => ({name: key}));

    fieldSets.forEach(fieldSet => {
        const mixin = fieldSet.name;
        const value = formValues[mixin];

        if (value) {
            mixinsToAdd.push(mixin);
        } else if (nodeData.mixinTypes.find(mixinType => mixinType.name === mixin)) {
            mixinsToDelete.push(mixin);
        }
    });

    return {
        mixinsToAdd,
        mixinsToDelete
    };
}

const getFieldValue = (field, nodeData) => {
    const property = nodeData.properties.find(prop => prop.name === field.name);
    if (!property) {
        return;
    }

    const selectorType = resolveSelectorType(field);
    if (selectorType) {
        if (selectorType.formatValue) {
            return selectorType.formatValue(property.value);
        }

        if (selectorType.key === 'DateTimePicker' || selectorType.key === 'DatePicker') {
            return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
        }
    }

    return field.multiple ? property.values : property.value;
};
