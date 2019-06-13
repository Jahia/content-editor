import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@jahia/design-system-kit';
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

const PickerEmptyCmp = ({classes, readOnly, pickerLabel, pickerIcon, children}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div data-sel-media-picker="empty">
            <button data-sel-field-picker-action="openPicker"
                    className={`${classes.add} ${readOnly ? classes.addReadOnly : ''}`}
                    type="button"
                    onClick={() => {
                        if (readOnly) {
                            return;
                        }

                        setIsOpen(true);
                    }}
            >
                {pickerIcon}
                <Typography variant="omega" color="beta">
                    {pickerLabel}
                </Typography>
            </button>
            <Dialog
                fullScreen
                open={isOpen}
                TransitionComponent={Transition}
            >
                {children(setIsOpen)}
            </Dialog>
        </div>
    );
};

PickerEmptyCmp.defaultProps = {
    readOnly: false
};

PickerEmptyCmp.propTypes = {
    readOnly: PropTypes.bool,
    pickerLabel: PropTypes.string.isRequired,
    pickerIcon: PropTypes.element.isRequired,
    children: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

const PickerEmpty = compose(
    translate(),
    withStyles(styles)
)(PickerEmptyCmp);

export {PickerEmpty};
