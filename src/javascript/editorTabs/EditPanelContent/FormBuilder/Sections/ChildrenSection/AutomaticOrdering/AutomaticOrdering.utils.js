import {Constants} from '~/ContentEditor.constants';

const orderingFieldsMapping = {
    [Constants.ordering.automaticOrdering.mixin + '_firstField']: {type: 'propField', index: 0, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.ordering.automaticOrdering.mixin + '_secondField']: {type: 'propField', index: 1, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.ordering.automaticOrdering.mixin + '_thirdField']: {type: 'propField', index: 2, displayNameKey: 'content-editor:label.contentEditor.section.listAndOrdering.orderBy'},
    [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: {type: 'directionField', index: 0},
    [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: {type: 'directionField', index: 1},
    [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: {type: 'directionField', index: 2}
};

export const adaptSectionToDisplayableRows = (orderedListFieldSet, t) => {
    const rows = [];
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
