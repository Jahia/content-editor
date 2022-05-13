import React, {useState} from 'react';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/Field';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {useFormikContext} from 'formik';
import {useTranslation} from 'react-i18next';
import {adaptSectionToDisplayableRows, getDisplayedRows} from './AutomaticOrdering.utils';
import {withStyles} from '@material-ui/core';
import {Button, Close} from '@jahia/moonstone';

const styles = theme => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginRight: `-${theme.spacing.unit * 6}px`,
        marginBottom: `-${theme.spacing.unit / 2}px`
    },
    orderBy: {
        flex: '2 0px'
    },
    orderDirection: {
        flex: '1 0 0'
    },
    addButton: {
        margin: `${theme.spacing.unit * 2}px 0`,
        textTransform: 'uppercase'
    }
});

export const AutomaticOrderingCmp = ({classes}) => {
    const {values, setFieldValue, setFieldTouched} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {sections} = useContentEditorSectionContext();
    const rows = adaptSectionToDisplayableRows(sections, t);
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
        setFieldValue(displayedRowToRemove.propField.name, undefined, true);
        setFieldTouched(displayedRowToRemove.propField.name, true, false);
        setFieldValue(displayedRowToRemove.directionField.name, undefined, true);
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
                        <div key={row.propField.name} className={classes.row}>
                            <div className={classes.orderBy}>
                                <FieldContainer field={row.propField} inputContext={getInputContext(index, row.propField)}/>
                            </div>
                            <div className={classes.orderDirection}>
                                <FieldContainer field={row.directionField} inputContext={getInputContext(index, row.directionField)}/>
                            </div>
                        </div>
                    );
                })}

            <Button className={classes.addButton}
                    data-sel-role="add-automatic-ordering-field"
                    isDisabled={!nextRow || nextRow.propField.readOnly}
                    label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                    onClick={() => add(nextRow, nextRowIndex)}/>
        </>
    );
};

AutomaticOrderingCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const AutomaticOrdering = compose(
    withStyles(styles)
)(AutomaticOrderingCmp);
AutomaticOrdering.displayName = 'AutomaticOrdering';
