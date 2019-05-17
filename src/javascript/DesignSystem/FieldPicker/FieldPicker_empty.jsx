import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/ds-mui-theme';
import Slide from '@material-ui/core/Slide';

import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import Dialog from '@material-ui/core/Dialog/Dialog';

const styles = theme => ({
    add: {
        width: '100%',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.omega,
        // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
        border: '1px #C1C8D5 dashed',
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
            // TODO border: `1px ${theme.palette.ui.zeta} dashed`,
            border: '1px #C1C8D5 solid',
            cursor: 'pointer'
        },
        '& svg': {
            marginRight: theme.spacing.unit,
            color: theme.palette.font.gamma
        }
    },
    addReadOnly: {
        '&:hover': {
            cursor: 'auto',
            border: '1px #C1C8D5 dashed'
        }
    }
});

function Transition(props) {
    return <Slide direction="up" {...props}/>;
}

export const FieldPickerEmptyCmp = ({classes, idInput, editorContext, onSelection, readOnly, pickerLabel, PickerIcon, picker: Picker}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div data-sel-media-picker="empty">
            <button data-sel-media-picker-action="openPicker"
                    className={`${classes.add} ${readOnly ? classes.addReadOnly : ''}`}
                    type="button"
                    onClick={() => {
                        if (readOnly) {
                            return;
                        }

                        setIsOpen(true);
                    }}
            >
                <PickerIcon/>
                <Typography variant="omega" color="beta">
                    {pickerLabel}
                </Typography>
            </button>
            <Dialog
                fullScreen
                open={isOpen}
                TransitionComponent={Transition}
            >
                <Picker idInput={idInput}
                        site={editorContext.site}
                        lang={editorContext.lang}
                        onCloseDialog={() => setIsOpen(false)}
                        onSelection={sel => {
                              onSelection(sel);
                              setIsOpen(false);
                          }}/>
            </Dialog>

        </div>
    );
};

FieldPickerEmptyCmp.defaultProps = {
    classes: {},
    readOnly: false
};

FieldPickerEmptyCmp.propTypes = {
    readOnly: PropTypes.bool,
    editorContext: PropTypes.object.isRequired,
    idInput: PropTypes.string.isRequired,
    pickerLabel: PropTypes.string.isRequired,
    PickerIcon: PropTypes.element.isRequired,
    onSelection: PropTypes.func.isRequired,
    picker: PropTypes.func.isRequired,
    classes: PropTypes.object
};

export const FieldPickerEmpty = compose(
    translate(),
    withStyles(styles)
)(FieldPickerEmptyCmp);

FieldPickerEmpty.displayName = 'FieldPickerEmpty';
