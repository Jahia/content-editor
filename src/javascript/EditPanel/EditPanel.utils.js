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
 * @param {array} sections the sections of the form
 * @returns {array} dynamic fieldSets with key value object
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
 * @param {array} sections    array object contains sections
 * @param {string} sectionName string value refer to the section name
 * @param {function} fieldSetFilter optional fieldset filter
 * @returns {array} fields    array object contains fields
 */
export function getFields(sections, sectionName, fieldSetFilter) {
    return sections.reduce((result, section) => {
        let fields = [];

        if (!sectionName || sectionName === section.name) {
            fields = section
                .fieldSets
                .filter(fieldset => fieldSetFilter ? fieldSetFilter(fieldset) : true)
                .reduce((result, fieldset) => ([...result, ...fieldset.fields]), []);
        }

        return [...result, ...fields];
    }, []);
}

export function getDataToMutate({nodeData, formValues, sections, lang}) {
    let propsToSave = [];
    let propsToDelete = [];

    if (!formValues) {
        return {propsToSave, propsToDelete};
    }

    const keys = Object.keys(formValues);
    const fields = sections && getFields(sections).filter(field => !field.readOnly);
    const mixinsToMutate = getMixinsToMutate(nodeData, formValues, sections);

    const _adaptDecimalValues = (fieldType, value) => {
        return fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;
    };

    keys.forEach(key => {
        const field = fields.find(field => field.name === key);
        if (field) {
            const value = formValues[key];
            if (value !== undefined && value !== null && value !== '') {
                const fieldType = field.requiredType;

                let valueToSave;
                if (field.multiple) {
                    const filteredUndefinedValues = value.filter(v => v !== undefined);
                    valueToSave = filteredUndefinedValues.map(value => _adaptDecimalValues(fieldType, value));
                } else {
                    // In case we have field of type decimal or double, we should store number
                    // with a decimal point separator instead of decimal comma separator into JCR.
                    valueToSave = _adaptDecimalValues(fieldType, value);
                }

                // Check if property has changed
                if (propertyHasChanged(valueToSave, field, nodeData)) {
                    const fieldSetName = getDynamicFieldSetNameOfField(sections, field);

                    // Is not dynamic OR is dynamic and node have the mixin
                    if (!fieldSetName ||
                        (fieldSetName &&
                            !mixinsToMutate.mixinsToDelete.includes(fieldSetName) &&
                            (hasNodeMixin(nodeData, fieldSetName) || mixinsToMutate.mixinsToAdd.includes(fieldSetName)))) {
                        const {name, option} = getValuePropName(field);
                        propsToSave.push({
                            name: field.propertyName,
                            type: fieldType,
                            option: option,
                            [name]: valueToSave,
                            language: lang
                        });
                    }
                }
            } else if (nodeData) {
                // Check if props existed before, to remove it
                const nodeProperty = nodeData.properties.find(prop => prop.name === field.propertyName);
                if (nodeProperty && nodeProperty[getValuePropName(field).name]) {
                    propsToDelete.push(field.propertyName);
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

/**
 * Get the value property name used to read the value(s) of a given property field
 * @param {object} field the property field
 * @returns {object} the name and option of the value property to use
 */
export function getValuePropName(field) {
    const result = field.multiple ? {name: 'values'} : {name: 'value'};

    if (field.selectorOptions?.find(selector => selector.name === 'password')) {
        result.option = 'ENCRYPTED';
    } else if (field.requiredType === 'DATE') {
        result.option = 'NOT_ZONED_DATE';
    }

    return result;
}

/**
 * Check if the value of a given field have changed, comparing the currentValue with the original value stored in the nodeData object
 * @param {*} currentValue the current field value
 * @param {object} field the field
 * @param {object} nodeData the original node data
 * @returns {boolean} true if the value have changed.
 */
export function propertyHasChanged(currentValue, field, nodeData) {
    // Retrieve previous value
    // TODO https://jira.jahia.org/browse/TECH-299 we could store initialValues in CE Context so we could compare them with currentValue instead of reading nodeData here
    const propertyData = nodeData && nodeData.properties && nodeData.properties.find(prop => prop.name === field.propertyName && prop.definition.declaringNodeType.name === field.nodeType);
    const previousValue = propertyData && propertyData[getValuePropName(field).name];

    // Compare previous value
    if (field.multiple) {
        // Check if both array are null or undefined
        if (!currentValue && !previousValue) {
            return false;
        }

        // Check if one array is null or undefined
        if (!currentValue || !previousValue) {
            return true;
        }

        // Check array size
        if (currentValue.length !== previousValue.length) {
            return true;
        }

        // Check values
        for (var i = 0; i < currentValue.length; ++i) {
            if (currentValue[i] !== previousValue[i]) {
                return true;
            }
        }

        return false;
    }

    return currentValue !== previousValue;
}

export function encodeJCRPath(path) {
    return path.split('/').map(entry => encodeURIComponent(entry)).join('/');
}

export function extractRangeConstraints(constraint) {
    // Validate constraint
    if (!/[([]+.*,.*[)\]]/.test(constraint)) {
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
 * This function allow to get the fieldSet name of given field name, only in case the fieldSet is dynamic
 * return undefined if the fieldSet of the field is not dynamic
 *
 * @param {array} sections sections datas
 * @param {object} sourceField field to search fieldSet
 * @returns {string} name of fieldSet
 */
export function getDynamicFieldSetNameOfField(sections, sourceField) {
    for (const section of sections) {
        for (const fieldSet of section.fieldSets) {
            if (fieldSet.dynamic && fieldSet.name === sourceField.nodeType) {
                return fieldSet.name;
            }
        }
    }
}

/**
 * This function check if the node has mixin or not.
 *
 * @param {object} node node to check if it has mixin or not
 * @param {string} mixin mixin name
 * @returns {boolean} true if the node has mixin, false otherwise.
 */
function hasNodeMixin(node, mixin) {
    return node && node.mixinTypes && node.mixinTypes.find(mixinType => mixinType.name === mixin);
}

function getMixinsToMutate(nodeData, formValues, sections) {
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

export function getChildrenOrder(formValues, nodeData) {
    const doNotModifyReturn = {shouldModifyChildren: false, childrenOrder: []};
    if (!formValues['Children::Order']) {
        return doNotModifyReturn;
    }

    const isChangedOrder = formValues['Children::Order'].find((child, i) => nodeData.children.nodes[i].name !== child.name);

    if (!isChangedOrder) {
        return doNotModifyReturn;
    }

    return {
        childrenOrder: formValues['Children::Order'].map(child => child.name),
        shouldModifyChildren: true
    };
}
