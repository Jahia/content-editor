import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {SaveButton} from '~/EditPanel/EditPanelDialogConfirmation/SaveButton';
import classes from './EditPanelDialogConfirmation.scss';

const useDialogKey = switchLang => {
    const rootProp = 'content-editor:label.contentEditor.edit.action.goBack';
    const [titleKey] = useState(`${rootProp}.edit.title`);
    const [messageKey, setMessageKey] = useState(`${rootProp}.edit.message`);

    useEffect(() => {
        if (switchLang) {
            setMessageKey(`${rootProp}.edit.switchLanguage`);
        }
    }, [switchLang]);

    return {titleKey, messageKey};
};

export const EditPanelDialogConfirmation = React.memo(({isOpen, switchLang = false, onCloseDialog, actionCallback}) => {
    const {t} = useTranslation('content-editor');
    const {titleKey, messageKey} = useDialogKey(switchLang);
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
            <DialogContent className={classes.dialogContent}>
                <Typography>
                    {t(messageKey)}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    size="big"
                    variant="ghost"
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
    isOpen: PropTypes.bool.isRequired,
    switchLang: PropTypes.bool,
    actionCallback: PropTypes.func.isRequired,
    onCloseDialog: PropTypes.func.isRequired
};

export default EditPanelDialogConfirmation;
