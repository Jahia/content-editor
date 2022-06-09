import React from 'react';
import PropTypes from 'prop-types';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import styles from './EditPanel.scss';
import clsx from 'clsx';
import {DisplayAction, DisplayActions, registry} from '@jahia/ui-extender';
import {Constants} from '~/ContentEditor.constants';
import {WindowListeners} from './WindowListeners';
import {DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import {Button, Checkbox, Edit, Typography} from '@jahia/moonstone';
import {GoBack} from '~/actions/contenteditor/goBackAction';
import {getButtonRenderer} from '~/utils/getButtonRenderer';
import {truncate} from '~/utils/helper';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {useTranslation} from 'react-i18next';
import HeaderBadges from './EditPanelHeader/HeaderBadges';

const ButtonRenderer = getButtonRenderer({
    defaultButtonProps: {size: 'big', className: styles.saveButtons},
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

const EditPanelCompact = ({title, createAnother}) => {
    const {siteInfo, nodeData, lang, mode} = useContentEditorContext();
    const contentEditorConfigContext = useContentEditorConfigContext();
    const {t} = useTranslation('content-editor');

    const tabs = registry.find({target: 'editHeaderTabsActions'});
    const EditTabComponent = tabs.find(tab => tab.value === Constants.editPanel.editTab).displayableComponent;

    return (
        <>
            <WindowListeners/>

            <DialogTitle disableTypography className={styles.dialogTitle} id="contenteditor-dialog-title">
                <div className="flexRow">
                    <Typography variant="heading">{truncate(title, 40)}</Typography>
                    <div className="flexFluid"/>
                    {mode !== Constants.routes.baseCreateRoute && <Button className={styles.uppercase} label={t('label.contentEditor.create.advanced')} icon={<Edit/>} onClick={contentEditorConfigContext.envProps.setFullscreen}/>}
                    <DisplayAction actionKey="content-editor/header/3dots" render={DotsButtonRenderer}/>
                </div>
                <div className={clsx('flexRow', styles.languageSwitcher)}>
                    <EditPanelLanguageSwitcher lang={lang} siteInfo={siteInfo}/>
                    <div className="flexFluid"/>
                    <HeaderBadges mode={mode}/>
                </div>
            </DialogTitle>
            <DialogContent className="flexCol" id="contenteditor-dialog-content" data-sel-role="form-container">
                <div className={clsx(styles.tab, 'flexCol')}>
                    <EditTabComponent nodePath={nodeData.path} lang={lang}/>
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
                <GoBack
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

EditPanelCompact.displayName = 'EditPanelCompact';
export default EditPanelCompact;
