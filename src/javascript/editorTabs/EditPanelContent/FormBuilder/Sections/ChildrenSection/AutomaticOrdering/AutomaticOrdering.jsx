import React, {useState} from 'react';
import {FieldContainer} from '../../../Field';
import {useFormikContext} from 'formik';
import {useTranslation} from 'react-i18next';
import {adaptSectionToDisplayableRows, getDisplayedRows} from './AutomaticOrdering.utils';
import {Button, Close} from '@jahia/moonstone';
import styles from './AutomaticOrdering.scss';
import PropTypes from 'prop-types';

export const AutomaticOrdering = ({orderingFieldSet}) => {
    const {values, setFieldValue, setFieldTouched} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const rows = adaptSectionToDisplayableRows(orderingFieldSet, t);
    const [displayedRows, setDisplayedRows] = useState(getDisplayedRows(rows, values));

    const _getNextRowIndexToAdd = () => {
        for (let i = 0; i < rows.length; i++) {
            if (!displayedRows.includes(i)) {
                return i;
            }
        }
    };

    const add = (nextRow, nextRowIndex) => {
        setDisplayedRows([...displayedRows, nextRowIndex]);

        setFieldValue(nextRow.propField.name, 'jcr:lastModified');
        setFieldTouched(nextRow.propField.name, true, false);
        setFieldValue(nextRow.directionField.name, 'desc');
        setFieldTouched(nextRow.directionField.name, true, false);
    };

    const remove = index => {
        // Remove from display
        const displayedRowToRemove = rows[displayedRows[index]];
        const currentDisplayedRows = displayedRows.slice();
        currentDisplayedRows.splice(index, 1);
        setDisplayedRows(currentDisplayedRows);

        // Unset values
        setFieldValue(displayedRowToRemove.propField.name, undefined);
        setFieldTouched(displayedRowToRemove.propField.name, true, false);
        setFieldValue(displayedRowToRemove.directionField.name, undefined);
        setFieldTouched(displayedRowToRemove.directionField.name, true, false);
    };

    const getInputContext = (index, field) => {
        const inputContext = {
            displayBadges: false,
            displayActions: false,
            displayLabels: index === 0,
            displayErrors: false
        };

        if (!field.name.endsWith('Direction')) {
            inputContext.actionRender = <></>;
        } else if (displayedRows.length > 1) {
            inputContext.actionRender = (
                <Button variant="ghost"
                        data-sel-role={`delete-automatic-ordering-field-${index}`}
                        aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                        icon={<Close/>}
                        disabled={field.readOnly}
                        onClick={() => {
                                remove(index);
                            }}
                />
            );
        }

        return inputContext;
    };

    const nextRowIndex = _getNextRowIndexToAdd();
    const nextRow = nextRowIndex !== undefined && rows[nextRowIndex];
    return (
        <>
            {displayedRows
                .map((displayableRow, index) => {
                    const row = rows[displayableRow];
                    return (
                        <div key={row.propField.name} className="flexRow">
                            <div className={styles.orderBy}>
                                <FieldContainer field={row.propField} inputContext={getInputContext(index, row.propField)}/>
                            </div>
                            <div className="flexFluid">
                                <FieldContainer field={row.directionField} inputContext={getInputContext(index, row.directionField)}/>
                            </div>
                        </div>
                    );
                })}

            <Button className={styles.addButton}
                    size="big"
                    data-sel-role="add-automatic-ordering-field"
                    isDisabled={!nextRow || nextRow.propField.readOnly}
                    label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                    onClick={() => add(nextRow, nextRowIndex)}/>
        </>
    );
};

AutomaticOrdering.propTypes = {
    orderingFieldSet: PropTypes.arrayOf(PropTypes.object).isRequired
};
