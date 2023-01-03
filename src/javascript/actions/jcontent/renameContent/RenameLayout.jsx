import React from 'react';
import {useTranslation} from 'react-i18next';
import {DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import styles from './RenameLayout.scss';
import {Typography} from '@jahia/moonstone';
import clsx from 'clsx';
import {EditPanelContent} from '~/editorTabs/EditPanelContent';
import {DisplayAction, DisplayActions} from '@jahia/ui-extender';
import {getButtonRenderer} from '~/utils';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {size: 'big'},
    noIcon: true
});

const accentColorButtonProps = {
    color: 'accent'
};

export const RenameLayout = () => {
    const {t} = useTranslation('content-editor');

    return (
        <>
            <DialogTitle disableTypography className={styles.dialogTitle} id="contenteditor-dialog-title">
                <div className="flexRow">
                    <Typography variant="heading">Rename</Typography>
                    <div className="flexFluid"/>
                </div>
            </DialogTitle>
            <DialogContent className={clsx(styles.dialogContent, 'flexCol')} id="contenteditor-dialog-content" data-sel-role="form-container">
                <div className={clsx('flexFluid', 'flexCol')}>
                    <EditPanelContent/>
                </div>
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                <div className="flexFluid"/>
                <DisplayAction
                    buttonLabel={t('label.contentEditor.cancel')}
                    actionKey="backButton"
                    render={ButtonRenderer}
                />
                <div className={styles.saveActions}>
                    <DisplayActions
                        buttonProps={accentColorButtonProps}
                        target="content-editor/header/main-save-actions"
                        render={ButtonRenderer}
                    />
                </div>
            </DialogActions>
        </>
    );
};
