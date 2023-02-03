import React, {useEffect, useRef} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog, IconButton, Slide} from '@material-ui/core';
import styles from './ContentEditorModal.scss';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {ceSwitchLanguage, ceToggleSections} from '~/registerReducer';
import {Button, Close} from '@jahia/moonstone';
import {useNotifications} from '@jahia/react-material';
import {useTranslation} from 'react-i18next';
import {OnCloseConfirmationDialog} from './OnCloseConfirmationDialog';
import {EditPanelCompact} from '~/ContentEditor/EditPanel/EditPanelCompact';
import {EditPanelFullscreen} from '~/ContentEditor/EditPanel/EditPanelFullscreen';
import {useApolloClient} from '@apollo/react-hooks';
import {useCreateFormDefinition} from '~/ContentEditor/useCreateFormDefinition';
import {useEditFormDefinition} from '~/ContentEditor/useEditFormDefinition';

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

export const ContentEditorModal = ({editorConfig, updateEditorConfig, deleteEditorConfig}) => {
    const notificationContext = useNotifications();

    const needRefresh = useRef(false);
    const openDialog = useRef();
    const dispatch = useDispatch();
    const client = useApolloClient();

    useEffect(() => {
        dispatch(ceSwitchLanguage(editorConfig.lang));
    }, [dispatch, editorConfig.lang]);

    const {t} = useTranslation();

    // Standalone env props
    const envProps = {
        back: () => {
            deleteEditorConfig();
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
                            updateEditorConfig({
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
        onSavedCallback: ({newNode, language, originalNode, updatedNode}, forceRedirect) => {
            if (newNode && (editorConfig.isFullscreen || forceRedirect)) {
                // Redirect to CE edit mode, for the created node
                needRefresh.current = false;
                updateEditorConfig({
                    ...editorConfig,
                    uuid: newNode.uuid,
                    lang: language ? language : editorConfig.lang,
                    mode: Constants.routes.baseEditRoute
                });
            } else if (!editorConfig.isFullscreen) {
                if (newNode) {
                    Promise.all(window.contentModificationEventHandlers.map(handler => handler(newNode.uuid, newNode.path, newNode.path.split('/').pop(), 'update'))).then(() => // Otherwise refresh and close
                        deleteEditorConfig());
                } else if (originalNode.path === updatedNode.path) {
                    deleteEditorConfig();
                } else {
                    client.cache.flushNodeEntryByPath(originalNode.path);
                    Promise.all(window.contentModificationEventHandlers.map(handler => handler(updatedNode.uuid, originalNode.path, updatedNode.path.split('/').pop(), 'update'))).then(() => // Otherwise refresh and close
                        deleteEditorConfig());
                }
            }
        },
        onCreateAnother: () => {
            updateEditorConfig({
                ...editorConfig,
                count: (editorConfig.count || 0) + 1
            });
        },
        switchLanguageCallback: language => {
            updateEditorConfig({
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
            updateEditorConfig({
                ...editorConfig,
                isFullscreen: true
            });
        },
        isModal: true,
        useFormDefinition: editorConfig.useFormDefinition || (editorConfig.mode === 'edit' ? useEditFormDefinition : useCreateFormDefinition),
        isFullscreen: editorConfig.isFullscreen,
        layout: editorConfig.layout || (editorConfig.isFullscreen ? EditPanelFullscreen : EditPanelCompact),
        confirmationDialog: (editorConfig.useConfirmationDialog !== false) && <OnCloseConfirmationDialog deleteEditorConfig={deleteEditorConfig} openDialog={openDialog}/>,
        formKey: editorConfig.formKey || 'modal'
    };

    // This is the only sure way to tell when content editor is no longer visible
    useEffect(() => {
        return () => {
            dispatch(ceToggleSections({key: envProps.formKey, sections: null}));
        };
    }, [dispatch, envProps.formKey]);

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
                onClose={() => openDialog.current ? openDialog.current() : deleteEditorConfig()}
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
                           count={editorConfig.count || 0}
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
        count: PropTypes.number,
        layout: PropTypes.object,
        formKey: PropTypes.string,
        useConfirmationDialog: PropTypes.bool
    }).isRequired,
    updateEditorConfig: PropTypes.func.isRequired,
    deleteEditorConfig: PropTypes.func.isRequired
};
