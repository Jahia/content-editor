export const removeMixinFromSection = (mixin, sections) => {
    let removedFields = [];
    let editorSection = sections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                removedFields = removedFields.concat(fieldSet.fields.filter(({nodeType}) => nodeType === mixin));
                return {...fieldSet,
                    fields: fieldSet.fields.filter(({nodeType}) => nodeType !== mixin)};
            })};
    });

    // Set the fields to the original section
    editorSection = editorSection.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                if (fieldSet.name === mixin) {
                    fieldSet.fields = removedFields;
                    fieldSet.activated = false;
                }

                return fieldSet;
            })
        };
    });
    return editorSection;
};

export const addMixinToSection = (mixin, editorSection, updatedField) => {
    // Add mixin and display fields from new value
    let addedFields = [];
    let sections = editorSection.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                addedFields = addedFields.concat(fieldSet.fields.filter(({nodeType}) => nodeType === mixin));
                return {...fieldSet,
                    fields: fieldSet.fields.filter(({nodeType}) => nodeType !== mixin)};
            })
        };
    });

    sections = sections.map(section => {
        return {...section,
            fieldSets: section.fieldSets.map(fieldSet => {
                if (fieldSet.name === mixin) {
                    fieldSet.dynamic = true;
                    fieldSet.activated = true;
                }

                let updatedFields = fieldSet.fields;
                if (updatedField.nodeType === fieldSet.name) {
                    updatedFields = fieldSet.fields.reduce((fields, field) => {
                        if (field.name === updatedField.name) {
                            return [...fields, field, ...addedFields];
                        }

                        return [...fields, field];
                    }, []);
                }

                return {...fieldSet, fields: updatedFields};
            })
        };
    });
    return sections;
};
