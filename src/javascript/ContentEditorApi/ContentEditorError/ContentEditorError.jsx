import React, {useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import {Button} from '@jahia/moonstone';
import {CeModalError} from '~/ContentEditorApi/ContentEditorError';
import {useTranslation} from 'react-i18next';
import styles from '../ContentEditorModal.scss';
import modalStyles from './ContentEditorError.scss';

const FullScreenError = props => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };

    const error = props.error; //inspect data here

    return (
        <Dialog fullScreen
                open={open}
                maxWidth="md"
                classes={{
            root: styles.ceDialogRootFullscreen
        }}
                onClose={handleClose}
        >
            {React.cloneElement(ErrorBoundary.defaultProps.fallback, {
                ...props, goBack: () => {
                    // Close the modal to go back to the previous screen
                    setOpen(false);
                    const cePartIndex = window.location.href.indexOf('#(contentEditor');
                    // Clean up the url if necessary
                    if (cePartIndex !== -1) {
                        window.location.href = window.location.href.slice(0, cePartIndex);
                    }
                }
            })}
        </Dialog>
    );
};

const ModalError = props => {
    const {t} = useTranslation('content-editor');
    const [isOpen, setOpen] = useState(true);
    const onClose = () => setOpen(false);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            data-sel-role="ce-error-dialog"
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle className={modalStyles.dialogTitle}>
                {t('content-editor:label.contentEditor.error.cannotOpen')}
            </DialogTitle>
            <DialogContent className={modalStyles.dialogContent}>
                {t('content-editor:label.contentEditor.error.notFound')}
            </DialogContent>
            <DialogActions className={modalStyles.dialogActions}>
                <Button
                    data-sel-role="close-button"
                    size="big"
                    label={t('content-editor:label.contentEditor.close')}
                    onClick={onClose}
                />
            </DialogActions>
        </Dialog>
    );
}

export const ContentEditorError = props => {
    const ErrorCmp = (props.error instanceof CeModalError) ? ModalError : FullScreenError;
    return <ErrorCmp {...props}/>;
}
