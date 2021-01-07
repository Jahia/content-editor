import React, {useState} from 'react';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {useTranslation} from 'react-i18next';
import {adaptSectionToDisplayableRows} from './AutomaticOrdering.utils';
import {getDisplayedRows} from './AutomaticOrdering.utils';
import {withStyles} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import {Button, IconButton} from '@jahia/design-system-kit';

const styles = theme => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: `-${theme.spacing.unit * 4}px`,
        marginRight: `-${theme.spacing.unit * 6}px`,
        marginBottom: `-${theme.spacing.unit / 2}px`
    },
    orderBy: {
        flex: '2 0px'
    },
    orderDirection: {
        marginLeft: `-${theme.spacing.unit / 2}px`,
        flex: '1 0 0'
    },
    addButton: {
        margin: `${theme.spacing.unit * 2}px 0`,
        textTransform: 'uppercase'
    }
});

export const AutomaticOrderingCmp = ({classes, formik: {values, setFieldValue, setFieldTouched}}) => {
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

        setFieldValue(nextRow.propField.name, 'jcr:lastModified', true);
        setFieldTouched(nextRow.propField.name, true);
        setFieldValue(nextRow.directionField.name, 'desc', true);
        setFieldTouched(nextRow.directionField.name, true);
    };

    const remove = index => {
        // Remove from display
        const displayedRowToRemove = rows[displayedRows[index]];
        const currentDisplayedRows = displayedRows.slice();
        currentDisplayedRows.splice(index, 1);
        setDisplayedRows(currentDisplayedRows);

        // Unset values
        setFieldValue(displayedRowToRemove.propField.name, undefined, true);
        setFieldTouched(displayedRowToRemove.propField.name, true);
        setFieldValue(displayedRowToRemove.directionField.name, undefined, true);
        setFieldTouched(displayedRowToRemove.directionField.name, true);
    };

    const getInputContext = (index, field) => {
        const inputContext = {
            displayBadges: false,
            displayLabels: index === 0,
            displayErrors: false,
            setActionContext: () => {}
        };

        if (!field.name.endsWith('Direction')) {
            inputContext.actionRender = <></>;
        } else if (displayedRows.length > 1) {
            inputContext.actionRender = (
                <IconButton variant="ghost"
                            data-sel-role={`delete-automatic-ordering-field-${index}`}
                            aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                            icon={<Clear/>}
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
                    variant="secondary"
                    disabled={!nextRow || nextRow.propField.readOnly}
                    onClick={() => add(nextRow, nextRowIndex)}
            >
                {t('content-editor:label.contentEditor.edit.fields.actions.add')}
            </Button>
        </>
    );
};

AutomaticOrderingCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export const AutomaticOrdering = compose(
    connect,
    withStyles(styles)
)(AutomaticOrderingCmp);
AutomaticOrdering.displayName = 'AutomaticOrdering';
