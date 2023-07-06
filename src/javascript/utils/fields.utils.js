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
 * @returns {object} dynamic fieldSets with key value object
 */
export function getDynamicFieldSets(sections) {
    return sections.reduce((result, section) => {
        const fieldSets = section
            .fieldSets
            .filter(filedSet => filedSet.dynamic)
            .reduce((result, fieldSet) => ({...result, [fieldSet.name]: fieldSet.activated}), {});

        return {...result, ...fieldSets};
    }, {});
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

const _adaptDecimalValues = (fieldType, value) => {
    return fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;
};

function updateValue({field, value, lang, nodeData, sections, mixinsToMutate, propsToSave, propsToDelete, propFieldNameMapping, forceUpdate}) {
    if (value !== undefined && value !== null && value !== '') {
        const fieldType = field.requiredType;

        let valueToSave;
        if (field.multiple) {
            const filteredUndefinedValues = value.filter(v => v !== undefined && v !== '');
            valueToSave = filteredUndefinedValues.map(value => _adaptDecimalValues(fieldType, value));
        } else {
            // In case we have field of type decimal or double, we should store number
            // with a decimal point separator instead of decimal comma separator into JCR.
            valueToSave = _adaptDecimalValues(fieldType, value);
        }

        // Check if property has changed
        if (propertyHasChanged(valueToSave, field, nodeData) || forceUpdate) {
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
            const fieldSetName = getDynamicFieldSetNameOfField(sections, field);
            if (!fieldSetName ||
                (fieldSetName &&
                    !mixinsToMutate.mixinsToDelete.includes(fieldSetName) &&
                    (hasNodeMixin(nodeData, fieldSetName) || mixinsToMutate.mixinsToAdd.includes(fieldSetName)))) {
                propsToDelete.push(field.propertyName);
            }
        }
    }

    propFieldNameMapping[field.propertyName] = field.name;
}

export function getDataToMutate({nodeData, formValues, i18nContext, sections, lang}) {
    let propsToSave = [];
    let propsToDelete = [];
    let propFieldNameMapping = {};

    if (!formValues) {
        return {propsToSave, propsToDelete};
    }

    const keys = new Set(Object.keys(formValues));
    Object.values(i18nContext).filter(ctx => ctx.values !== undefined).forEach(ctx => Object.keys(ctx.values).forEach(k => keys.add(k)));
    const fields = sections && getFields(sections);
    const mixinsToMutate = getMixinsToMutate(nodeData, formValues, sections);

    keys.forEach(key => {
        const field = fields.find(field => field.name === key);
        if (field) {
            const value = formValues[key];
            updateValue({field, value, lang, nodeData, sections, mixinsToMutate, propsToSave, propsToDelete, propFieldNameMapping});

            if (field.i18n) {
                Object.keys(i18nContext).filter(i18nLang => i18nLang !== lang && i18nLang !== 'shared' && i18nLang !== 'memo').forEach(i18nLang => {
                    const translatedValue = i18nContext[i18nLang].values[key];
                    if (typeof translatedValue !== 'undefined') {
                        // This means there are updated values in other languages, and we want to save them without relaying on propertyHasChanged()
                        // as the value in i18nContext may be identical to value in current language as is the case when copy-to-language is used.
                        const forceUpdate = true;
                        updateValue({
                            field,
                            value: translatedValue,
                            lang: i18nLang,
                            nodeData,
                            sections,
                            mixinsToMutate,
                            propsToSave,
                            propsToDelete,
                            propFieldNameMapping,
                            forceUpdate
                        });
                    }
                });
            }
        }
    });

    return {
        propsToSave,
        propsToDelete,
        mixinsToAdd: mixinsToMutate.mixinsToAdd,
        mixinsToDelete: mixinsToMutate.mixinsToDelete,
        propFieldNameMapping
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
 * Get the property name where the value is stored for a property type
 * @param field which contains the property type
 * @returns {string} property name for comparison
 * @private
 */
function _getPropertyNameToCompare(field) {
    if (field.requiredType === 'DATE') {
        return field.multiple ? 'notZonedDateValues' : 'notZonedDateValue';
    }

    return field.multiple ? 'values' : 'value';
}

/**
 * Check if two value are different
 * @param firstValue first value to compare
 * @param secondValue second value to compare
 * @param requiredType type of the values
 * @returns {boolean} true if the value are different
 */
export function checkIfValuesAreDifferent(firstValue, secondValue, requiredType) {
    if (requiredType === 'BOOLEAN') {
        const firstValueToString = firstValue === undefined ? undefined : firstValue.toString();
        const secondValueToString = secondValue === undefined ? undefined : secondValue.toString();
        return firstValueToString !== secondValueToString;
    }

    return firstValue !== secondValue;
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
    const previousValue = propertyData && propertyData[_getPropertyNameToCompare(field)];

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
            if (checkIfValuesAreDifferent(currentValue[i], previousValue[i], field.requiredType)) {
                return true;
            }
        }

        return false;
    }

    return checkIfValuesAreDifferent(currentValue, previousValue, field.requiredType);
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

export function isDirty(formik, i18nContext) {
    return formik.dirty || Object.keys(i18nContext).filter(l => l !== 'shared' && l !== 'memo').length > 0;
}
