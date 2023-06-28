import React from 'react';
import PropTypes from 'prop-types';
import {useContentEditorConfigContext, useContentEditorContext} from '~/contexts';
import styles from './EditPanel.scss';
import clsx from 'clsx';
import {DisplayAction, DisplayActions, registry} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';
import {DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {Button, Checkbox, Edit, Typography} from '@jahia/moonstone';
import {getButtonRenderer, truncate} from '~/utils';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {useTranslation} from 'react-i18next';
import {HeaderBadges} from './HeaderBadges';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {size: 'big'},
    noIcon: true
});

const DotsButtonRenderer = getButtonRenderer({
    labelStyle: 'none',
    defaultButtonProps: {
        variant: 'ghost'
    }
});

const accentColorButtonProps = {
    color: 'accent'
};

export const EditPanelCompact = ({title, createAnother}) => {
    const {mode} = useContentEditorContext();
    const {updateEditorConfig} = useContentEditorConfigContext();
    const {t} = useTranslation('content-editor');

    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditPanelContent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;

    const setFullscreen = () => updateEditorConfig({
        isFullscreen: true
    });

    return (
        <>
            <DialogTitle disableTypography className={styles.dialogTitle} id="contenteditor-dialog-title">
                <div className="flexRow">
                    <Typography variant="heading">{truncate(title, 40)}</Typography>
                    <div className="flexFluid"/>
                    {mode !== Constants.routes.baseCreateRoute && <Button className={styles.uppercase} label={t('label.contentEditor.create.advanced')} icon={<Edit/>} data-sel-role="advancedMode" onClick={setFullscreen}/>}
                    <DisplayAction actionKey="content-editor/header/3dots" render={DotsButtonRenderer}/>
                </div>
                <div className={clsx('flexRow', styles.languageSwitcher)}>
                    <EditPanelLanguageSwitcher/>
                    <div className="flexFluid"/>
                    <HeaderBadges mode={mode}/>
                </div>
            </DialogTitle>
            <DialogContent className="flexCol" id="contenteditor-dialog-content" data-sel-role="form-container">
                <div className={clsx('flexFluid', 'flexCol')}>
                    <EditPanelContent/>
                </div>
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                {createAnother && (
                    <>
                        <Checkbox className={styles.checkbox} id="createAnother" checked={createAnother.value} onChange={() => createAnother.set(!createAnother.value)}/>
                        <Typography isUpperCase component="label" htmlFor="createAnother" variant="button" className={styles.checkbox}>
                            {t('label.contentEditor.create.createButton.createAnother')}
                        </Typography>
                    </>
                )}
                <div className="flexFluid"/>
                <DisplayAction
                    buttonLabel={t('label.contentEditor.cancel')}
                    actionKey="backButton"
                    render={ButtonRenderer}
                />
                <div className={styles.saveActions}>
                    <DisplayActions
                        buttonProps={accentColorButtonProps}
                        createAnother={createAnother?.value}
                        target="content-editor/header/main-save-actions"
                        render={ButtonRenderer}
                    />
                </div>
            </DialogActions>
        </>
    );
};

EditPanelCompact.propTypes = {
    title: PropTypes.string.isRequired,
    createAnother: PropTypes.object
};
