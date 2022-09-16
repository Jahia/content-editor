import React, {useEffect, useRef} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog, IconButton, Slide} from '@material-ui/core';
import styles from './ContentEditorModal.scss';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {ceToggleSections, DEFAULT_OPENED_SECTIONS} from '~/registerReducer';
import {Button, Close} from '@jahia/moonstone';
import {useNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {OnCloseConfirmationDialog} from './OnCloseConfirmationDialog';

function triggerEvents(nodeUuid, operator) {
    // Refresh contentEditorEventHandlers
    if (window.top.contentEditorEventHandlers && Object.keys(window.top.contentEditorEventHandlers).length > 0) {
        Object.values(window.top.contentEditorEventHandlers)
            .forEach(handler =>
                handler({nodeUuid: nodeUuid, operator: operator})
            );
    }
}

const Transition = React.forwardRef((props, ref) => {
    return <Slide ref={ref} direction="up" {...props}/>;
});

export const ContentEditorModal = ({editorConfig, setEditorConfig}) => {
    const notificationContext = useNotifications();

    const needRefresh = useRef(false);
    const openDialog = useRef();
    const dispatch = useDispatch();

    // This is the only sure way to tell when content editor is no longer visible
    useEffect(() => {
        return () => {
            dispatch(ceToggleSections(DEFAULT_OPENED_SECTIONS));
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const {t} = useTranslation();

    // Standalone env props
    const envProps = {
        back: () => {
            setEditorConfig(false);
        },
        disabledBack: () => false,
        createCallback: ({newNode}) => {
            needRefresh.current = true;
            if (editorConfig && editorConfig.createCallback) {
                editorConfig.createCallback(newNode, envProps);
            }

            triggerEvents(newNode.uuid, Constants.operators.create);

            const opts = editorConfig && editorConfig.isFullscreen ? ['closeButton'] : {
                action: [
                    <Button
                        key="edit"
                        isReversed
                        variant="outlined"
                        label={t('content-editor:label.contentEditor.edit.contentEdit')}
                        onClick={() => {
                            setEditorConfig({
                                ...editorConfig,
                                isFullscreen: false,
                                uuid: newNode.uuid,
                                mode: Constants.routes.baseEditRoute
                            });
                            notificationContext.closeNotification();
                        }}
                    />,
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => notificationContext.closeNotification()}
                    >
                        <Close/>
                    </IconButton>
                ]
            };

            notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), opts);
        },

        editCallback: ({originalNode, updatedNode}) => {
            needRefresh.current = true;
            if (editorConfig && editorConfig.editCallback) {
                editorConfig.editCallback(updatedNode, originalNode, envProps);
            }

            triggerEvents(updatedNode.uuid, Constants.operators.update);

            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        },
        onSavedCallback: ({newNode, language}, forceRedirect) => {
            if (newNode && (editorConfig.isFullscreen || forceRedirect)) {
                // Redirect to CE edit mode, for the created node
                needRefresh.current = false;
                if (editorConfig) {
                    setEditorConfig({
                        ...editorConfig,
                        uuid: newNode.uuid,
                        lang: language ? language : editorConfig.lang,
                        mode: Constants.routes.baseEditRoute
                    });
                }
            } else if (!editorConfig.isFullscreen) {
                // Otherwise refresh and close
                setEditorConfig(false);
            }
        },
        onCreateAnother: () => {
            setEditorConfig({
                ...editorConfig,
                count: (editorConfig.count || 0) + 1
            });
        },
        switchLanguageCallback: language => {
            setEditorConfig({
                ...editorConfig,
                lang: language
            });
        },
        onClosedCallback: () => {
            if (editorConfig && editorConfig.onClosedCallback) {
                editorConfig.onClosedCallback(envProps, needRefresh.current);
            }
        },
        redirectBreadcrumbCallback: () => {
            envProps.back();
        },
        setFullscreen: () => {
            setEditorConfig({
                ...editorConfig,
                isFullscreen: true
            });
        },
        isModal: true,
        isFullscreen: editorConfig?.isFullscreen,
        confirmationDialog: <OnCloseConfirmationDialog setEditorConfig={setEditorConfig} openDialog={openDialog}/>
    };

    const classes = editorConfig.isFullscreen ? {
        root: styles.ceDialogRootFullscreen
    } : {
        paper: styles.ceDialogContent
    };

    return (
        <Dialog open
                disableAutoFocus
                disableEnforceFocus
                maxWidth="md"
                fullScreen={editorConfig.isFullscreen}
                TransitionComponent={Transition}
                aria-labelledby="dialog-content-editor"
                classes={classes}
                onClose={() => openDialog.current && openDialog.current()}
                onRendered={() => window.focus()}
        >
            <ContentEditor mode={editorConfig.mode}
                           uuid={editorConfig.uuid}
                           lang={editorConfig.lang}
                           uilang={editorConfig.uilang}
                           site={editorConfig.site}
                           contentType={editorConfig.contentType}
                           name={editorConfig.name}
                           count={editorConfig.count || 0}
                           envProps={envProps}
            />
        </Dialog>
    );
};

ContentEditorModal.propTypes = {
    editorConfig: PropTypes.object.isRequired,
    setEditorConfig: PropTypes.func.isRequired
};
