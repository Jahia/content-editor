import React, {useEffect, useRef, useState} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog, IconButton} from '@material-ui/core';
import styles from './ContentEditorApi.scss';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {ceToggleSections, DEFAULT_OPENED_SECTIONS} from '~/redux/registerReducer';
import {Button} from '@jahia/moonstone';
import {Close} from '@material-ui/icons';
import {useNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';

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
    const [confirmationConfig, setConfirmationConfig] = useState(false);

    const dirtyRef = useRef(false);
    const needRefresh = useRef(false);
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
        dirtyRef,
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

            notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), {
                action: [
                    <Button
                        key="edit"
                        isReversed
                        variant="outlined"
                        label={t('content-editor:label.contentEditor.edit.contentEdit')}
                        onClick={() => {
                            setEditorConfig({
                                ...editorConfig,
                                isFullscreen: true,
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
            });
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
        confirmationDialog: confirmationConfig && (
            <EditPanelDialogConfirmation
                isOpen
                actionCallback={() => setEditorConfig(false)}
                onCloseDialog={() => setConfirmationConfig(false)}
            />
        )
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
                onClose={() => (envProps.dirtyRef.current) ? setConfirmationConfig(true) : setEditorConfig(false)}
                onRendered={() => window.focus()}
        >
            <ContentEditor mode={editorConfig.mode}
                           uuid={editorConfig.uuid}
                           lang={editorConfig.lang}
                           uilang={editorConfig.uilang}
                           site={editorConfig.site}
                           contentType={editorConfig.contentType}
                           name={editorConfig.name}
                           envProps={envProps}
            />
        </Dialog>
    );
};

ContentEditorModal.propTypes = {
    editorConfig: PropTypes.object.isRequired,
    setEditorConfig: PropTypes.func.isRequired
};
