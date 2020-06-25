/**
 * Move the fields defined by a mixin to their initial location
 * @param mixin the name of the mixin of the fields to move
 * @param sections list of sections containing the fieldset and fields
 * @param formik formik
 * @returns list of the updated sections
 */
export const moveMixinToInitialFieldset = (mixin, sections, formik) => {
    let updatedSections = sections;
    if (mixin) {
        formik.setFieldValue(mixin, false, true);
        formik.setFieldTouched(mixin, false);
        updatedSections = moveFieldsToAnotherFieldset(mixin, mixin, updatedSections, null);
    }

    return updatedSections;
};

/**
 * Move the fields of a fieldset to another fieldset whatever the section.
 * If the parameter 'field' is present,  the fields to move will be placed after this field in the fieldset
 * @param originFieldsetName the name of the fielset containing the fields to move
 * @param targetFieldsetName the targeted fieldset
 * @param sections List of section containing the fieldsets
 * @param field (optional) field preceding the new location of the moved fields
 * @returns sections with the updated fieldsets
 */
export const moveFieldsToAnotherFieldset = (originFieldsetName, targetFieldsetName, sections, field) => {
    let fields = [];
    let updatedSections = sections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                fields = fields.concat(fieldSet.fields.filter(({nodeType}) => nodeType === originFieldsetName));
                return {...fieldSet,
                    fields: fieldSet.fields.filter(({nodeType}) => nodeType !== originFieldsetName)};
            })};
    });

    updatedSections = updatedSections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldset => {
                if (fieldset.name === targetFieldsetName) {
                    addFieldsToFieldset(fields, fieldset, field);
                }

                return fieldset;
            })
        };
    });
    return updatedSections;
};

/**
 * Add a field to a fieldset
 * if the parameter 'afterField' is present, the fields to move will be placed after this field in the fieldset
 * @param fieldsToAdd fields to add
 * @param fieldset targeted fieldset
 * @param afterField field preceding the new location of the moved fields
 * @returns the updated fieldset
 */
export const addFieldsToFieldset = (fieldsToAdd, fieldset, afterField) => {
    if (afterField) {
        fieldset.fields = fieldset.fields.reduce((fields, field) => {
            if (field.name === afterField.name) {
                return [...fields, field, ...fieldsToAdd];
            }

            return [...fields, field];
        }, []);
    } else {
        fieldset.fields = fieldset.fields.concat(fieldsToAdd);
    }

    return fieldset;
};

/**
 * Move the fields of a mixin to a fieldset
 * @param mixin the mixin of the fields to move
 * @param targetFieldset The new location of the fields
 * @param sections list of sections containing the fieldsets and fields
 * @param updatedField the field preceding the new location of the moved fields
 * @param formik formik
 * @returns list of updated sections
 */
export const moveMixinToTargetFieldset = (mixin, targetFieldset, sections, updatedField, formik) => {
    // Add mixin and display fields from new value
    let updatedSections = sections;
    if (mixin) {
        formik.setFieldValue(mixin, true, true);
        formik.setFieldTouched(mixin, false);
        updatedSections = moveFieldsToAnotherFieldset(mixin, targetFieldset, updatedSections, updatedField);
    }

    return updatedSections;
};

export default {
    moveMixinToInitialFieldset,
    moveMixinToTargetFieldset,
    addFieldsToFieldset,
    moveFieldsToAnotherFieldset
};
