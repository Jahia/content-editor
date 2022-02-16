import React from 'react';
import {Dialog, DialogActions, DialogTitle} from '@material-ui/core';
import {Button} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {SaveButton} from '~/EditPanel/EditPanelDialogConfirmation/SaveButton';

export const EditPanelDialogConfirmation = React.memo(({titleKey, isOpen, onCloseDialog, actionCallback}) => {
    const {t} = useTranslation('content-editor');
    const handleDiscard = () => {
        onCloseDialog();

        // Undefined: overridedStoredLocation
        // True: byPassEventTriggers (we dont want to perform event triggers in case of nothing have been saved/created)
        actionCallback(undefined, true);
    };

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
                <SaveButton actionCallback={actionCallback} onCloseDialog={onCloseDialog}/>
            </DialogActions>
        </Dialog>
    );
});

EditPanelDialogConfirmation.name = 'EditPanelDialogConfirmation';

EditPanelDialogConfirmation.propTypes = {
    titleKey: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default EditPanelDialogConfirmation;
