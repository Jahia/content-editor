import React, {useContext, useEffect, useState} from 'react';
import {withNotifications} from '@jahia/react-material';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {Error} from '@material-ui/icons';
import {useContentEditorContext, useContentEditorConfigContext} from '~/ContentEditor.context';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {Constants} from '~/ContentEditor.constants';
import {useContentEditorHistory} from '~/ContentEditorHistory';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {
    Button,
    ButtonGroup,
    Chip,
    Separator,
    Tab,
    TabItem,
    Typography
} from '@jahia/moonstone';
import styles from './EditPanel.scss';
import {EditPanelDialogConfirmation} from '~/EditPanel/EditPanelDialogConfirmation';

const EditPanelCmp = ({formik, title, notificationContext, client}) => {
    const {t} = useTranslation();
    const {nodeData, siteInfo, lang, uilang, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();
    const {registerBlockListener, unRegisterBlockListener} = useContentEditorHistory();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    useEffect(() => {
        if (formik.dirty) {
            registerBlockListener(t('content-editor:label.contentEditor.edit.action.goBack.title'));
        } else {
            unRegisterBlockListener();
        }

        if (envProps.initCallback) {
            envProps.initCallback(formik);
        }

        const handleBeforeUnloadEvent = ev => {
            if (formik.dirty) {
                ev.preventDefault();
                ev.returnValue = '';
            }
        };

        // Prevent close browser's tab when there is unsaved content
        window.addEventListener('beforeunload', handleBeforeUnloadEvent);
        return () => {
            window.removeEventListener(
                'beforeunload',
                handleBeforeUnloadEvent
            );
        };
    }, [formik.dirty, openConfirmDialog]);

    const publicationInfoContext = useContext(PublicationInfoContext);

    const actionContext = {
        nodeData,
        language: lang,
        uilang,
        mode,
        t,
        client, // TODO BACKLOG-11290 find another way to inject apollo-client, i18n, ...}
        notificationContext,
        publicationInfoContext,
        formik,
        siteInfo
    };

    const [activeTab, setActiveTab] = useState('edit');
    const SelectedTabComponents = {
        edit: EditPanelContent,
        advanced: AdvancedOptions
    };
    const SelectedTabComponent = SelectedTabComponents[activeTab];
    return (
        <MainLayout
            header={
                <ContentHeader>
                    <>
                        <EditPanelDialogConfirmation
                            formik
                            titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                            open={formik.dirty && openConfirmDialog}
                            actionCallback={() => envProps.back()}
                            onCloseDialog={() => setOpenConfirmDialog(false)}
                        />
                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <DisplayActions
                                    context={{nodeData, siteInfo, formik}}
                                    target="editHeaderPathActions"
                                    render={({context}) => (
                                        <Button
                                            data-sel-role="backButton"
                                            icon={context.buttonIcon}
                                            disabled={context.disabled}
                                            onClick={e => {
                                                e.stopPropagation();
                                                context.onClick(context, e);
                                            }}
                                        />
                                    )}
                                />

                                <Typography isNowrap className={styles.headerTypography} variant="heading">
                                    {title}
                                </Typography>
                            </div>

                            <div className={styles.headerRight}>
                                <DisplayActions
                                    context={{
                                        ...actionContext,
                                        isMainButton: true
                                    }}
                                    target="editHeaderActions"
                                    render={({context}) => (
                                        <>
                                            {context.enabled &&
                                            <>
                                                <Button
                                                    icon={context.buttonIcon}
                                                    label={t(context.buttonLabel).toUpperCase()}
                                                    color={context.color}
                                                    variant={context.variant || 'default'}
                                                    disabled={context.disabled}
                                                    data-sel-role={context.dataSelRole}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        context.onClick(context, e);
                                                    }}
                                                />

                                                {context.addWarningBadge && (
                                                    <Error data-sel-role={`${context.actionKey}_pastille`}
                                                           className={styles.warningBadge}/>
                                                )}
                                            </>}
                                        </>
                                    )}
                                />

                                {mode === Constants.routes.baseEditRoute &&
                                <ButtonGroup
                                    color="accent"
                                    size="big"
                                >
                                    <DisplayAction
                                        actionKey="ContentEditorHeaderMenu"
                                        context={actionContext}
                                        render={({context}) => (
                                            <Button
                                                data-sel-role="ContentEditorHeaderMenu"
                                                color="accent"
                                                icon={context.buttonIcon}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    context.onClick(context, e);
                                                }}
                                            />
                                        )}
                                    />
                                </ButtonGroup>}
                            </div>
                        </div>

                        <div className={styles.header}>
                            <div className={styles.headerLeft}>
                                <Chip
                                    label={nodeData.primaryNodeType.displayName}
                                    color="accent"
                                />
                            </div>

                            <div className={styles.headerRight}>
                                <PublicationInfoBadge/>
                                <LockInfoBadge/>
                            </div>
                        </div>

                        <Separator/>

                        <div className={styles.headerToolBar}>
                            <EditPanelLanguageSwitcher lang={lang}
                                                       siteInfo={siteInfo}
                            />

                            <Separator variant="vertical"/>

                            <Tab>
                                <DisplayActions
                                    context={{
                                        ...actionContext,
                                        setActiveTab: setActiveTab,
                                        activeTab: activeTab
                                    }}
                                    target="editHeaderTabsActions"
                                    render={({context}) => (
                                        <TabItem
                                            data-sel-role={context.dataSelRole}
                                            icon={context.buttonIcon}
                                            label={t(context.buttonLabel)}
                                            isSelected={context.selected}
                                            onClick={e => {
                                                e.stopPropagation();
                                                context.onClick(context, e);
                                            }}
                                        />
                                    )}
                                />
                            </Tab>
                        </div>
                    </>
                </ContentHeader>
            }
        >
            <SelectedTabComponent isDirty={formik.dirty} formik={formik}/>
        </MainLayout>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    withNotifications(),
    withApollo
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
