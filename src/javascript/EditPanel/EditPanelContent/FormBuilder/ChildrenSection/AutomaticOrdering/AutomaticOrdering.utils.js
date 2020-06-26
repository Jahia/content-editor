import {Constants} from '~/ContentEditor.constants';

const orderingFieldsMapping = {
    firstField: {type: 'propField', index: 0},
    secondField: {type: 'propField', index: 1},
    thirdField: {type: 'propField', index: 2},
    firstDirection: {type: 'directionField', index: 0},
    secondDirection: {type: 'directionField', index: 1},
    thirdDirection: {type: 'directionField', index: 2}
};

export const adaptSectionToDisplayableRows = sections => {
    const rows = [];
    const listOrderingSection = sections.find(section => section.name === Constants.automaticOrdering.section);
    if (listOrderingSection) {
        const orderedListFieldSet = listOrderingSection.fieldSets.find(fieldSet => fieldSet.name === Constants.automaticOrdering.mixin);
        if (orderedListFieldSet) {
            orderedListFieldSet.fields.forEach(field => {
                const fieldMapped = orderingFieldsMapping[field.name];
                if (fieldMapped) {
                    if (!rows[fieldMapped.index]) {
                        rows.splice(fieldMapped.index, 0, {});
                    }

                    rows[fieldMapped.index][fieldMapped.type] = field;
                }
            });
        }
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
