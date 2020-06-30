import React, {useState} from 'react';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {FieldContainer} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field';
import PropTypes from 'prop-types';
import {compose} from '~/utils';
import {connect} from 'formik';
import {Button} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
import {adaptSectionToDisplayableRows} from './AutomaticOrdering.utils';
import {getDisplayedRows} from './AutomaticOrdering.utils';
import {withStyles} from '@material-ui/core';
import {Clear} from '@material-ui/icons';
import {IconButton} from '@jahia/design-system-kit';

const styles = theme => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: `-${theme.spacing.unit * 4}px`,
        marginRight: `-${theme.spacing.unit * 6}px`
    },
    orderBy: {
        flex: '2 0px'
    },
    orderDirection: {
        flex: '1 0 0'
    }
});

export const AutomaticOrderingCmp = ({classes, formik: {values, setFieldValue, setFieldTouched}}) => {
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

            <Button
                data-sel-role="add-automatic-ordering-field"
                color="accent"
                size="big"
                variant="outlined"
                label={t('content-editor:label.contentEditor.edit.fields.actions.add')}
                disabled={displayedRows.length === rows.length}
                onClick={add}
            />
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
