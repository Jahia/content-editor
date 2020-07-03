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
import {useContentEditorContext} from '~/ContentEditor.context';

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
    const context = useContentEditorContext();
    const {t} = useTranslation();
    const {sections} = useContentEditorSectionContext();
    const rows = adaptSectionToDisplayableRows(sections, t);
    const [displayedRows, setDisplayedRows] = useState(getDisplayedRows(rows, values));

    const add = () => {
        for (let i = 0; i < rows.length; i++) {
            if (!displayedRows.includes(i)) {
                const rowToDisplay = rows[i];
                setDisplayedRows([...displayedRows, i]);

                setFieldValue(rowToDisplay.propField.name, 'jcr:lastModified', true);
                setFieldTouched(rowToDisplay.propField.name, true);
                setFieldValue(rowToDisplay.directionField.name, 'desc', true);
                setFieldTouched(rowToDisplay.directionField.name, true);
                return;
            }
        }
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

    const getInputContext = (index, isDirection) => {
        const inputContext = {
            displayBadges: false,
            displayLabels: index === 0,
            displayErrors: false,
            setActionContext: () => {}
        };

        if (!isDirection) {
            inputContext.actionRender = <></>;
        } else if (displayedRows.length > 1) {
            inputContext.actionRender = (
                <IconButton variant="ghost"
                            data-sel-role={`delete-automatic-ordering-field-${index}`}
                            aria-label={t('content-editor:label.contentEditor.edit.fields.actions.clear')}
                            icon={<Clear/>}
                            disabled={context.nodeData.lockedAndCannotBeEdited || !context.nodeData.hasWritePermission}
                            onClick={() => {
                                remove(index);
                            }}
                />
            );
        }

        return inputContext;
    };

    return (
        <>
            {displayedRows
                .map((displayableRow, index) => {
                    const row = rows[displayableRow];
                    return (
                        <div key={row.propField.name} className={classes.row}>
                            <div className={classes.orderBy}>
                                <FieldContainer field={row.propField} inputContext={getInputContext(index, false)}/>
                            </div>
                            <div className={classes.orderDirection}>
                                <FieldContainer field={row.directionField} inputContext={getInputContext(index, true)}/>
                            </div>
                        </div>
                    );
                })}

            <Button className={classes.addButton}
                    data-sel-role="add-automatic-ordering-field"
                    variant="secondary"
                    disabled={displayedRows.length === rows.length || context.nodeData.lockedAndCannotBeEdited || !context.nodeData.hasWritePermission}
                    onClick={add}
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
