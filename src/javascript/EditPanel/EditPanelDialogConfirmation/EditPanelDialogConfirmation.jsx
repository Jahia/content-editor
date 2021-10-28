import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogTitle
} from '@material-ui/core';
import {Button} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {Constants} from '~/ContentEditor.constants';

export const EditPanelDialogConfirmation = ({titleKey, isOpen, onCloseDialog, actionCallback, formik}) => {
    const {t} = useTranslation('content-editor');
    const handleDiscard = () => {
        onCloseDialog();

        // Undefined: overridedStoredLocation
        // True: byPassEventTriggers (we dont want to perform event triggers in case of nothing have been saved/created)
        actionCallback(undefined, true);
    };

    const handleSave = () => {
        onCloseDialog();

        // Override default submit callback to execute the confirmation callback instead
        formik.setFieldValue(Constants.systemFields.OVERRIDE_SUBMIT_CALLBACK, actionCallback, false);
        formik.submitForm();
    };

    let disabled = false;

    const errors = formik.errors;
    if (errors) {
        disabled = Object.keys(errors).length > 0;
    }

    return (
        <Dialog
            maxWidth="md"
            aria-labelledby="alert-dialog-slide-title"
            open={isOpen}
            onClose={onCloseDialog}
        >
            <DialogTitle id="alert-dialog-slide-title">
                {t(titleKey)}
            </DialogTitle>
            <DialogActions>
                <Button
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.action.goBack.btnContinue')}
                    onClick={onCloseDialog}
                />
                <Button
                    size="big"
                    label={t('content-editor:label.contentEditor.edit.action.goBack.btnDiscard')}
                    onClick={handleDiscard}
                />
                <Button
                    color="accent"
                    size="big"
                    isDisabled={disabled}
                    label={t('content-editor:label.contentEditor.edit.action.goBack.btnSave')}
                    onClick={handleSave}
                />
            </DialogActions>
        </Dialog>
    );
};

EditPanelDialogConfirmation.propTypes = {
    titleKey: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formik: PropTypes.object.isRequired,
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default EditPanelDialogConfirmation;
