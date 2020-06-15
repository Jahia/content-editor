export const moveMixinToInitialSection = (mixin, sections) => {
    let updatedSections = sections;
    if (mixin) {
        updatedSections = moveFieldsToAnotherSection(mixin, mixin, updatedSections, null);
        updatedSections = activateOrDeactivateFieldSet(updatedSections, mixin, false);
    }

    return updatedSections;
};

export const activateOrDeactivateFieldSet = (sections, fieldsetName, activate) => {
    return sections.map(section => {
        return {
            ...section,
            fieldSets: section.fieldSets.map(fieldset => {
                if (fieldsetName === fieldset.name) {
                    return {...fieldset, activated: activate, dynamic: activate};
                }

                return fieldset;
            })};
    });
};

export const moveFieldsToAnotherSection = (originSectionName, targetSectionName, sections, field) => {
    let fields = [];
    let updatedSections = sections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                fields = fields.concat(fieldSet.fields.filter(({nodeType}) => nodeType === originSectionName));
                return {...fieldSet,
                    fields: fieldSet.fields.filter(({nodeType}) => nodeType !== originSectionName)};
            })};
    });

    updatedSections = updatedSections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldset => {
                if (fieldset.name === targetSectionName) {
                    addFieldsToFieldset(fields, fieldset, field);
                }

                return fieldset;
            })
        };
    });
    return updatedSections;
};

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

export const moveMixinToTargetSection = (mixin, targetSection, sections, updatedField) => {
    // Add mixin and display fields from new value
    let updatedSections = activateOrDeactivateFieldSet(sections, mixin, true);

    updatedSections = moveFieldsToAnotherSection(mixin, targetSection, updatedSections, updatedField);

    return updatedSections;
};

export default {
    moveMixinToInitialSection,
    moveMixinToTargetSection,
    activateOrDeactivateFieldSet,
    moveFieldsToAnotherSection
};
