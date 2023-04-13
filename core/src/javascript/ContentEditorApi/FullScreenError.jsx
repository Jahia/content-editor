import React, {useState} from 'react';
import {Dialog} from '@material-ui/core';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import styles from './ContentEditorModal.scss';

export const FullScreenError = props => {
    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
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
