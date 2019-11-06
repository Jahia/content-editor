import React, {useEffect, useRef} from 'react';
import {Badge, MainLayout, IconButton} from '@jahia/design-system-kit';
import {buttonRenderer, DisplayActions, ContextualMenu, withNotifications} from '@jahia/react-material';
import PropTypes from 'prop-types';
import {compose, withApollo} from 'react-apollo';
import {translate} from 'react-i18next';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {MoreVert, Error} from '@material-ui/icons';
import {useContentEditorContext} from '~/ContentEditor.context';
import {withStyles} from '@material-ui/core';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';

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
    }
});

const EditPanelCmp = ({formik, title, classes, t, notificationContext, client}) => {
    const {nodeData, siteInfo, lang, uiLang} = useContentEditorContext();
    const contentEditorHeaderMenu = useRef(null);

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

    return (
        <MainLayout
            topBarProps={{
                path: <DisplayActions context={{nodeData, siteInfo}}
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
                                nodeData,
                                language: lang,
                                uiLang,
                                isMainButton: true,

                                // TODO BACKLOG-11290 find another way to inject apollo-client, i18n, ...}
                                t,
                                client,
                                notificationContext
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
                        <ContextualMenu
                            ref={contentEditorHeaderMenu}
                            context={{
                                nodeData,
                                language: lang,
                                uiLang,

                                // TODO BACKLOG-11290 find another way to inject apollo-client, i18n, ...}
                                t,
                                client,
                                notificationContext,
                                formik
                            }}
                            actionKey="ContentEditorHeaderMenu"
                        />
                        <IconButton data-sel-action="moreActions"
                                    aria-label={t('content-editor:label.contentEditor.edit.action.fieldMoreOptions')}
                                    icon={<MoreVert/>}
                                    color="inverted"
                                    onClick={event => {
                                        event.stopPropagation();
                                        contentEditorHeaderMenu.current.open(event);
                                    }}
                        />
                        <PublicationInfoBadge/>
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
    t: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    translate(),
    withNotifications(),
    withApollo,
    withStyles(styles)
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
