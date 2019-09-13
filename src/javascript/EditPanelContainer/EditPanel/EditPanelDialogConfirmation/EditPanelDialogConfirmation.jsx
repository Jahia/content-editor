import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle
} from '@material-ui/core';
import {Button} from '@jahia/design-system-kit';
import * as PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';

export const EditPanelDialogConfirmation = ({t, titleKey, open, onCloseDialog, actionCallback, formik}) => {
    const handleDiscard = () => {
        onCloseDialog();

        actionCallback();
    };

    const handleSave = () => {
        onCloseDialog();

        const {setFieldValue, submitForm} = formik;
        setFieldValue(Constants.editPanel.OPERATION_FIELD, Constants.editPanel.submitOperation.SAVE, false);

        submitForm().then(() => actionCallback());
    };

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
                <Button variant="primary" onClick={handleSave}>
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
