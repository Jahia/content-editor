import React, {useEffect, useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {Button, Typography} from '@jahia/moonstone';
import * as PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {SaveButton} from './SaveButton';
import styles from './EditPanelDialogConfirmation.scss';
import {useContentEditorContext} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';

/**
 * Build title key and dialog message key depending on the mode and switchLang flag
 * @returns {{messageKey: string, titleKey: string}}
 */
const useDialogText = (switchLang, mode) => {
    const rootProp = 'content-editor:label.contentEditor.edit.action.goBack';
    const [titleKey, setTitleKey] = useState(`${rootProp}.edit.title`);
    const [messageKey, setMessageKey] = useState(`${rootProp}.edit.message`);

    useEffect(() => {
        const isEditMode = mode === Constants.routes.baseEditRoute;
        if (switchLang || !isEditMode) {
            const messageKey = (switchLang) ? 'switchLanguage' : 'message';
            const modeKey = mode || 'edit';
            setMessageKey(`${rootProp}.${modeKey}.${messageKey}`);
            if (!isEditMode) {
                setTitleKey(`${rootProp}.${modeKey}.title`);
            }
        }
    }, [switchLang, mode]);

    return {titleKey, messageKey};
};

export const EditPanelDialogConfirmation = React.memo(({isOpen, switchLang = false, onCloseDialog, actionCallback}) => {
    const {t} = useTranslation('content-editor');
    const {mode, lang, siteInfo} = useContentEditorContext();
    const {titleKey, messageKey} = useDialogText(switchLang, mode);
    const handleDiscard = () => {
        onCloseDialog();
        actionCallback({discard: true});
    };

    const langName = siteInfo?.languages?.find(l => l.language === lang)?.displayName || '';
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
            <DialogContent className={styles.dialogContent}>
                <Typography>
                    {t(messageKey, {langName})}
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
