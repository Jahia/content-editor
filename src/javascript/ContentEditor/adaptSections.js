import {Constants} from '~/ContentEditor.constants';

export const adaptSections = sections => {
    const cloneSections = JSON.parse(JSON.stringify(sections));

    return cloneSections
        .reduce((result, section) => {
            if (section.name === 'metadata') {
                section.fieldSets = section.fieldSets.reduce((fieldSetsField, fieldSet) => {
                    if (fieldSet.fields.find(f => f.readOnly)) {
                        return [...fieldSetsField];
                    }

                    return [...fieldSetsField, fieldSet];
                }, []);
            }

            section.fieldSets = section.fieldSets.map(fieldSet => {
                return {
                    ...fieldSet, fields: fieldSet.fields.map(field => {
                        return {
                            ...field,
                            nodeType: fieldSet.name, // Store fieldSet original inside the field, useful for testing the nodeType declaring this prop
                            name: field.name === 'ce:systemName' ? Constants.systemName.name : fieldSet.name + '_' + field.name, // Generate input name
                            propertyName: field.name // JCR property name, used for saving
                        };
                    })
                };
            });

            return [...result, section];
        }, [])
        .filter(section => (section.name === 'listOrdering' || (section.fieldSets && section.fieldSets.length > 0)));
};

/** Utility function to return an object of expanded status for the given sections **/
export const getExpandedSections = sections => {
    return sections ? sections.reduce((result, section) => ({...result, [section.name]: section.expanded}), {}) : {};
};
