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
import {Typography} from '@jahia/design-system-kit';
import {Button} from '@jahia/moonstone';
import {useTranslation} from 'react-i18next';
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

const SaveErrorModalCmp = ({nbOfErrors, classes, open, onClose}) => {
    const {t} = useTranslation('content-editor');
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
                <Button
                    size="big"
                    color="accent"
                    data-sel-role="content-type-dialog-cancel"
                    label={t('content-editor:label.contentEditor.edit.action.save.validation.modalButton')}
                    onClick={onClose}
                />
            </DialogActions>
        </Dialog>
    );
};

SaveErrorModalCmp.propTypes = {
    nbOfErrors: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export const SaveErrorModal = withStyles(styles)(SaveErrorModalCmp);
SaveErrorModal.displayName = 'SaveErrorModal';
