import React, {useContext, useEffect, useState} from 'react';
import {Badge} from '@jahia/design-system-kit';
import {buttonRenderer, withNotifications, iconButtonRenderer} from '@jahia/react-material';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {Error} from '@material-ui/icons';
import {useContentEditorContext} from '~/ContentEditor.context';
import {withStyles} from '@material-ui/core';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {Constants} from '~/ContentEditor.constants';

import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {Separator, Tab, TabItem} from '@jahia/moonstone';
import {truncate} from '~/utils/helper';

// TODO: BACKLOG-12100 update header style
const styles = theme => ({
    actionButtonHeaderContainer: {
        position: 'relative'
    },
    warningBadge: {
        position: 'absolute',
        top: '-0.5em',
        right: 0,
        backgroundColor: theme.palette.layout.dark,
        borderRadius: '50%',
        color: theme.palette.support.gamma
    },
    badges: {
        position: 'absolute',
        marginTop: '47px',
        marginLeft: '-50px'
    },
    mainLayoutRoot: {
        minHeight: '100vh'
    },
    root: {
        display: 'flex'
    },
    toolbar: {
        display: 'flex'
    }
});

const EditPanelCmp = ({formik, title, classes, notificationContext, client}) => {
    const {t} = useTranslation();
    const {nodeData, siteInfo, lang, uilang, mode} = useContentEditorContext();

    useEffect(() => {
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
    }, [formik.dirty]);

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
        advanced: () => (<h1>Advanced</h1>) // TODO: BACKLOG-12102
    };
    const SelectedTabComponent = SelectedTabComponents[activeTab];

    return (
        <MainLayout
            header={
                <ContentHeader
                    title={
                        // TODO: BACKLOG-12100 update header style
                        <>
                            <DisplayActions
                                context={{nodeData, siteInfo, formik}}
                                target="editHeaderPathActions"
                                render={({context}) => {
                                    const Button = iconButtonRenderer({
                                        color: 'primary',
                                        'data-sel-action': 'goBackAction'
                                    });

                                    return <Button context={context}/>;
                                }}
                            />
                            {truncate(title)}
                        </>
                    }
                    mainAction={
                        // TODO: BACKLOG-12100 update header style
                        <div className={classes.root}>
                            <Separator variant="vertical"/>

                            <DisplayActions
                                context={{
                                    ...actionContext,
                                    isMainButton: true
                                }}
                                target="editHeaderActions"
                                render={({context}) => {
                                    const Button = buttonRenderer({
                                        variant: 'primary',
                                        disabled: context.disabled
                                    }, true, null, true);

                                    return (
                                        <div className={classes.actionButtonHeaderContainer}>
                                            <Button disabled context={context}/>
                                            {context.addWarningBadge && (
                                                <Error data-sel-role={`${context.actionKey}_pastille`}
                                                       className={classes.warningBadge}/>
                                            )}
                                        </div>
                                    );
                                }}
                            />
                            {mode === Constants.routes.baseEditRoute && <DisplayAction
                                actionKey="ContentEditorHeaderMenu"
                                context={actionContext}
                                render={iconButtonRenderer({
                                    color: 'primary',
                                    'data-sel-action': 'moreActions'
                                })}
                            />}
                            <div className={classes.badges}>
                                <PublicationInfoBadge/>
                                <LockInfoBadge/>
                            </div>
                        </div>
                    }
                    breadcrumb={
                        // TODO: BACKLOG-12100 update header style
                        <>
                            <EditPanelLanguageSwitcher lang={lang}
                                                       siteInfo={siteInfo}
                            />

                            <Badge badgeContent={nodeData.primaryNodeType.displayName}
                                   variant="normal"
                                   color="ghost"
                            />
                        </>
                    }
                    toolbar={
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
                    }
                />
            }
        >
            <SelectedTabComponent isDirty={formik.dirty}/>
        </MainLayout>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    withNotifications(),
    withApollo,
    withStyles(styles)
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
