import {Constants} from '~/ContentEditor.constants';

const orderingFieldsMapping = {
    [Constants.automaticOrdering.mixin + '_firstField']: {type: 'propField', index: 0, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.automaticOrdering.mixin + '_secondField']: {type: 'propField', index: 1, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.automaticOrdering.mixin + '_thirdField']: {type: 'propField', index: 2, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.automaticOrdering.mixin + '_firstDirection']: {type: 'directionField', index: 0},
    [Constants.automaticOrdering.mixin + '_secondDirection']: {type: 'directionField', index: 1},
    [Constants.automaticOrdering.mixin + '_thirdDirection']: {type: 'directionField', index: 2}
};

export const getAutomaticOrderingFieldSet = sections => {
    const listOrderingSection = sections.find(section => section.name === Constants.automaticOrdering.section);
    if (listOrderingSection) {
        return listOrderingSection.fieldSets.find(fieldSet => fieldSet.name === Constants.automaticOrdering.mixin);
    }
};

export const adaptSectionToDisplayableRows = (sections, t) => {
    const rows = [];
    const orderedListFieldSet = getAutomaticOrderingFieldSet(sections);
    if (orderedListFieldSet) {
        orderedListFieldSet.fields.forEach(field => {
            const fieldMapped = orderingFieldsMapping[field.name];
            if (fieldMapped) {
                if (!rows[fieldMapped.index]) {
                    rows.splice(fieldMapped.index, 0, {});
                }

                if (fieldMapped.displayNameKey) {
                    field.displayName = t(fieldMapped.displayNameKey);
                }

                rows[fieldMapped.index][fieldMapped.type] = field;
            }
        });
    }

    return rows;
};

export const getDisplayedRows = (rows, values) => {
    const displayedRows = [];
    if (rows && rows.length > 0) {
        rows.forEach((row, index) => {
            if (values[row.propField.name]) {
                displayedRows.push(index);
            }
        });
        if (displayedRows.length === 0) {
            displayedRows.push(0);
        }
    }

    return displayedRows;
};
