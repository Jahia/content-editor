import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from '@material-ui/core';
import {Error} from '@material-ui/icons';
import {Button, Typography} from '@jahia/design-system-kit';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';

const styles = theme => ({
    icon: {
        color: theme.palette.support.gamma,
        marginRight: '0.2rem',
        width: '1.7rem',
        height: '1.7rem'
    },
    dialogTitle: {
        '& h6': {
            display: 'flex',
            alignItems: 'center'
        }
    }
});

const SaveErrorModalCmp = ({t, nbOfErrors, classes, open, onClose}) => {
    return (
        <Dialog open={open} aria-labelledby="dialog-errorBeforeSave" onClose={onClose}>
            <DialogTitle id="dialog-errorBeforeSave" className={classes.dialogTitle}>
                <Error className={classes.icon}/>
                <Typography color="alpha" variant="delta">
                    {t('content-editor:label.contentEditor.edit.action.save.validation.modalTitle')}
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {t('content-editor:label.contentEditor.edit.action.save.validation.modalMessage', {count: nbOfErrors})}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button variant="secondary" data-sel-role="content-type-dialog-cancel" onClick={onClose}>
                    {t('content-editor:label.contentEditor.edit.action.save.validation.modalButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

SaveErrorModalCmp.propTypes = {
    t: PropTypes.func.isRequired,
    nbOfErrors: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export const SaveErrorModal = compose(
    translate(),
    withStyles(styles)
)(SaveErrorModalCmp);
SaveErrorModal.displayName = 'SaveErrorModal';
