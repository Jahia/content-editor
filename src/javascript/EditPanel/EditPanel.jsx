import React, {useContext, useEffect} from 'react';
import {Badge, MainLayout} from '@jahia/design-system-kit';
import {buttonRenderer, withNotifications, iconButtonRenderer} from '@jahia/react-material';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import PropTypes from 'prop-types';
import {compose, withApollo} from 'react-apollo';
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
        formik
    };
    return (
        <MainLayout
            topBarProps={{
                path: <DisplayActions context={{nodeData, siteInfo, formik}}
                                      target="editHeaderPathActions"
                                      render={({context}) => {
                                          const Button = buttonRenderer({variant: 'ghost', color: 'inverted'}, true);
                                          return <Button context={context}/>;
                                      }}
                />,
                title,
                titleProps: {
                    component: 'h1'
                },
                contextModifiers: (
                    <>
                        <EditPanelLanguageSwitcher lang={lang}
                                                   siteInfo={siteInfo}
                        />

                        <Badge badgeContent={nodeData.primaryNodeType.displayName}
                               variant="normal"
                               color="ghost"
                        />
                    </>
                ),
                actions: (
                    <>
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
                                            <Error data-sel-role={`${context.actionKey}_pastille`} className={classes.warningBadge}/>
                                        )}
                                    </div>
                                );
                            }}
                        />
                        {mode === Constants.routes.baseEditRoute && <DisplayAction
                            actionKey="ContentEditorHeaderMenu"
                            context={actionContext}
                            render={iconButtonRenderer({
                                color: 'inverted',
                                'data-sel-action': 'moreActions'
                            })}
                        />}
                        <div className={classes.badges}>
                            <PublicationInfoBadge/>
                            <LockInfoBadge/>
                        </div>
                    </>
                )
            }}
        >
            <EditPanelContent isDirty={formik.dirty}/>
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
