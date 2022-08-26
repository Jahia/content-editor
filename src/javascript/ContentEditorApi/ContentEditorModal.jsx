import React, {useEffect, useRef} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog, IconButton, Slide} from '@material-ui/core';
import styles from './ContentEditorModal.scss';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {ceSwitchLanguage, ceToggleSections, DEFAULT_OPENED_SECTIONS} from '~/registerReducer';
import {Button, Close} from '@jahia/moonstone';
import {useNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {OnCloseConfirmationDialog} from './OnCloseConfirmationDialog';
import {EditPanelCompact} from '~/ContentEditor/EditPanel/EditPanelCompact';
import {EditPanelFullscreen} from '~/ContentEditor/EditPanel/EditPanelFullscreen';

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
    }, [dispatch]);

    useEffect(() => {
        dispatch(ceSwitchLanguage(editorConfig.lang));
    }, [dispatch, editorConfig.lang]);

    const {t} = useTranslation();

    // Standalone env props
    const envProps = {
        back: () => {
            setEditorConfig(false);
        },
        disabledBack: () => false,
        createCallback: ({newNode}) => {
            needRefresh.current = true;
            if (editorConfig.createCallback) {
                editorConfig.createCallback(newNode, envProps);
            }

            triggerEvents(newNode.uuid, Constants.operators.create);

            const opts = editorConfig.isFullscreen ? ['closeButton'] : {
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
            if (editorConfig.editCallback) {
                editorConfig.editCallback(updatedNode, originalNode, envProps);
            }

            triggerEvents(updatedNode.uuid, Constants.operators.update);

            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton']);
        },
        onSavedCallback: ({newNode, language}, forceRedirect) => {
            if (newNode && (editorConfig.isFullscreen || forceRedirect)) {
                // Redirect to CE edit mode, for the created node
                needRefresh.current = false;
                setEditorConfig({
                    ...editorConfig,
                    uuid: newNode.uuid,
                    lang: language ? language : editorConfig.lang,
                    mode: Constants.routes.baseEditRoute
                });
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
            if (editorConfig.onClosedCallback) {
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
        useFormDefinition: editorConfig.useFormDefinition,
        isFullscreen: editorConfig.isFullscreen,
        layout: editorConfig.layout || (editorConfig.isFullscreen ? EditPanelFullscreen : EditPanelCompact),
        confirmationDialog: (editorConfig.useConfirmationDialog !== false) && <OnCloseConfirmationDialog setEditorConfig={setEditorConfig} openDialog={openDialog}/>
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
                onClose={() => openDialog.current ? openDialog.current() : setEditorConfig(false)}
                onRendered={() => window.focus()}
                {...editorConfig.dialogProps}
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
    editorConfig: PropTypes.shape({
        mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
        uuid: PropTypes.string,
        lang: PropTypes.string,
        uilang: PropTypes.string,
        site: PropTypes.string,
        contentType: PropTypes.string,
        name: PropTypes.string,
        isFullscreen: PropTypes.bool,
        createCallback: PropTypes.func,
        editCallback: PropTypes.func,
        onClosedCallback: PropTypes.func,
        useFormDefinition: PropTypes.func,
        dialogProps: PropTypes.object,
        layout: PropTypes.object,
        useConfirmationDialog: PropTypes.bool
    }).isRequired,
    setEditorConfig: PropTypes.func.isRequired
};
