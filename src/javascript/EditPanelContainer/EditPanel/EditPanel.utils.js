/**
 * This function perform creation of object contains only dynamic fieldSets
 * The dynamic fieldSet retrieved from sections will be added to object with
 * name as key and activated property as value.
 *
 * Example:
 * {
 *     "jmix:tagged": true,
 *     "jmix:keywords": false,
 *     ...
 * }
 *
 * Note: the activated property will be used to determine if the dynamic
 * fieldSet will be active on the form or not.
 *
 * @param sections array object contains sections
 * @returns dynamic fieldSets with key value object
 */
export function getDynamicFieldSets(sections) {
    return sections.reduce((result, section) => {
        const fieldSets = section
            .fieldSets
            .filter(filedSet => filedSet.dynamic)
            .reduce((result, fieldSet) => ({...result, [fieldSet.name]: fieldSet.activated}), {});

        return {...result, ...fieldSets};
    }, []);
}

/**
 * The function used to retrieve all the fields within fieldSets of each section
 *
 * There is specific case:
 * - When the sectionName parameter is provided, the function returns all
 * the fields in fieldSets of only the specified section.
 *
 * @param sections    array object contains sections
 * @param sectionName string value refer to the section name
 * @returns fields    array object contains fields
 */
export function getFields(sections, sectionName) {
    return sections.reduce((result, section) => {
        let fields = [];

        if (!sectionName || sectionName === section.name) {
            fields = section
                .fieldSets
                .reduce((result, fieldset) => ([...result, ...fieldset.fields]), []);
        }

        return [...result, ...fields];
    }, []);
}

export function getDataToMutate(nodeData = {}, formValues = {}, sections, lang) {
    const keys = Object.keys(formValues);
    const fields = sections && getFields(sections).filter(field => !field.readOnly);

    const mixinsToMutate = getMixinsToMutate(nodeData, formValues, sections);

    let propsToSave = [];
    let propsToDelete = [];

    keys.forEach(key => {
        const field = fields.find(field => field.name === key);

        if (field) {
            const value = formValues[key];
            if (value !== undefined && value !== null && value !== '') {
                const fieldType = field.requiredType;

                const valueObj = {};

                if (field.multiple) {
                    const filteredUndefinedValues = value.filter(v => v !== undefined);

                    if (fieldType === 'DATE') {
                        valueObj.notZonedDateValues = filteredUndefinedValues;
                    } else {
                        valueObj.values = filteredUndefinedValues;
                    }
                } else if (fieldType === 'DATE') {
                    valueObj.notZonedDateValue = value;
                } else {
                    // In case we have field of type decimal or double, we should store number
                    // with a decimal point separator instead of decimal comma separator into JCR.
                    valueObj.value = fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;
                }

                const fieldSet = getDynamicFieldSetOfField(sections, key);

                if (!fieldSet.name ||
                    (fieldSet.name && (hasNodeMixin(nodeData, fieldSet.name) || mixinsToMutate.mixinsToAdd.includes(fieldSet.name)))) {
                    propsToSave.push({
                        name: key,
                        type: fieldType,
                        ...valueObj,
                        language: lang
                    });
                }
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
        propsToDelete,
        mixinsToAdd: mixinsToMutate.mixinsToAdd,
        mixinsToDelete: mixinsToMutate.mixinsToDelete
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

/**
 * This function allow to get the fieldSet name of given field name
 *
 * @param {array} sections sections datas
 * @param {string} fieldName field name to search fieldSet
 * @returns {object} name of fieldSet
 */
export function getDynamicFieldSetOfField(sections, fieldName) {
    return sections.reduce((result, section) => {
        const value = section.fieldSets
            .filter(filedSet => filedSet.dynamic)
            .reduce((result, fieldSet) => {
                if (fieldSet.fields.find(field => field.name === fieldName)) {
                    const name = fieldSet.name;
                    return {...result, name};
                }

                return {...result};
            }, {});
        return {...result, ...value};
    }, {});
}

/**
 * This function check if the node has mixin or not.
 *
 * @param node
 * @param mixin
 * @returns boolean value, true if the node has mixin, false otherwise.
 */
function hasNodeMixin(node, mixin) {
    return node.mixinTypes && node.mixinTypes.find(mixinType => mixinType.name === mixin);
}

function getMixinsToMutate(nodeData = {}, formValues = {}, sections) {
    let mixinsToAdd = [];
    let mixinsToDelete = [];

    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Get keys of the dynamic fieldSets object
    const mixins = Object.keys(dynamicFieldSets);

    /**
     * Iterate trough mixins:
     * - Check if the node has the mixin
     * - Check if the value is defined on the form values
     *
     * Depending on the conditions, add the mixin to the dedicated
     * remove/add array.
     **/
    mixins.forEach(mixin => {
        const value = formValues[mixin];

        if (!hasNodeMixin(nodeData, mixin) && value) {
            mixinsToAdd.push(mixin);
        } else if (hasNodeMixin(nodeData, mixin) && !value) {
            mixinsToDelete.push(mixin);
        }
    });

    // Return object contains an array of mixins to add and an array of mixins to delete
    return {
        mixinsToAdd,
        mixinsToDelete
    };
}
