import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle
} from '@material-ui/core';
import {Button} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';

export const EditPanelDialogConfirmation = ({t, titleKey, open, onCloseDialog, actionCallback, formik}) => {
    const handleDiscard = () => {
        onCloseDialog();

        actionCallback();
    };

    const handleSave = () => {
        onCloseDialog();

        const {submitForm} = formik;

        submitForm().then(() => actionCallback());
    };

    let disabled = false;

    const errors = formik.errors;
    if (errors) {
        disabled = Object.keys(errors).length > 0;
    }

    return (
        <Dialog aria-labelledby="alert-dialog-slide-title"
                open={open}
                onClose={onCloseDialog}
        >
            <DialogTitle id="alert-dialog-slide-title">
                {t(titleKey)}
            </DialogTitle>
            <DialogActions>
                <Button variant="secondary" onClick={onCloseDialog}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnContinue')}
                </Button>
                <Button variant="secondary" onClick={handleDiscard}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnDiscard')}
                </Button>
                <Button variant="primary" disabled={disabled} onClick={handleSave}>
                    {t('content-editor:label.contentEditor.edit.action.goBack.btnSave')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

EditPanelDialogConfirmation.propTypes = {
    t: PropTypes.func.isRequired,
    titleKey: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

EditPanelDialogConfirmation.displayName = 'EditPanelDialogConfirmation';

export default translate()(EditPanelDialogConfirmation);
