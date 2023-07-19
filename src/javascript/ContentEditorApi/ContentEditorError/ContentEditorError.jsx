import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import {Button} from '@jahia/moonstone';
import {CeModalError} from '~/ContentEditorApi/ContentEditorError';
import {useTranslation} from 'react-i18next';
import styles from '../ContentEditorModal.scss';
import modalStyles from './ContentEditorError.scss';

function updateWindowLocation() {
    const cePartIndex = window.location.href.indexOf('#(contentEditor');
    // Clean up the url if necessary
    if (cePartIndex !== -1) {
        window.location.href = window.location.href.slice(0, cePartIndex);
    }
}

const FullScreenError = props => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
        updateWindowLocation();
    };

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
                    updateWindowLocation();
                }
            })}
        </Dialog>
    );
};

const ModalError = () => {
    const {t} = useTranslation('content-editor');
    const [isOpen, setOpen] = useState(true);
    const onClose = () => {
        setOpen(false);
        updateWindowLocation();
    };

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
};

export const ContentEditorError = errorProps => {
    const ErrorCmp = (errorProps.error instanceof CeModalError) ? ModalError : FullScreenError;
    return <ErrorCmp {...errorProps}/>;
};

ContentEditorError.propTypes = {
    errorProps: {
        error: PropTypes.object
    }
};
