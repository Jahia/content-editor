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
import {registry} from '@jahia/ui-extender';

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

    const editorConfigFromRegistry = registry.get('content-editor-config', editorConfig.configName);
    const mergedConfig = {
        ...editorConfigFromRegistry,
        ...editorConfig
    };

    // Standalone env props
    const envProps = {
        back: () => {
            deleteEditorConfig();
        },
        disabledBack: () => false,
        createCallback: ({newNode}) => {
            needRefresh.current = true;
            if (mergedConfig.createCallback) {
                mergedConfig.createCallback(newNode, envProps);
            }

            triggerEvents(newNode.uuid, Constants.operators.create);

            const predefined = mergedConfig.isFullscreen ? ['closeButton'] : [];
            const opts = mergedConfig.isFullscreen ? {
                autoHideDuration: 3000
            } : {
                autoHideDuration: 3000,
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

            notificationContext.notify(t('content-editor:label.contentEditor.create.createButton.success'), predefined, opts);
        },

        editCallback: ({originalNode, updatedNode}) => {
            needRefresh.current = true;
            if (mergedConfig.editCallback) {
                mergedConfig.editCallback(updatedNode, originalNode, envProps);
            }

            triggerEvents(updatedNode.uuid, Constants.operators.update);

            notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton'], {autoHideDuration: 3000});
        },
        onSavedCallback: ({newNode, language, originalNode, updatedNode}, forceRedirect) => {
            if (newNode && (mergedConfig.isFullscreen || forceRedirect)) {
                // Redirect to CE edit mode, for the created node
                needRefresh.current = false;
                updateEditorConfig({
                    ...editorConfig,
                    uuid: newNode.uuid,
                    lang: language ? language : mergedConfig.lang,
                    mode: Constants.routes.baseEditRoute
                });
            } else if (!mergedConfig.isFullscreen) {
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
                count: (mergedConfig.count || 0) + 1
            });
        },
        switchLanguageCallback: language => {
            updateEditorConfig({
                ...editorConfig,
                lang: language
            });
        },
        onClosedCallback: () => {
            if (mergedConfig.onClosedCallback) {
                mergedConfig.onClosedCallback(envProps, needRefresh.current);
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
        useFormDefinition: mergedConfig.useFormDefinition || (mergedConfig.mode === 'edit' ? useEditFormDefinition : useCreateFormDefinition),
        isFullscreen: mergedConfig.isFullscreen,
        layout: mergedConfig.layout || (mergedConfig.isFullscreen ? EditPanelFullscreen : EditPanelCompact),
        confirmationDialog: mergedConfig.mode === 'edit' && <OnCloseConfirmationDialog deleteEditorConfig={deleteEditorConfig} openDialog={openDialog}/>,
        formKey: mergedConfig.formKey || 'modal'
    };

    // This is the only sure way to tell when content editor is no longer visible
    useEffect(() => {
        return () => {
            dispatch(ceToggleSections({key: envProps.formKey, sections: null}));
        };
    }, [dispatch, envProps.formKey]);

    const classes = mergedConfig.isFullscreen ? {
        root: styles.ceDialogRootFullscreen
    } : {
        paper: styles.ceDialogContent
    };

    return (
        <Dialog open
                disableAutoFocus
                disableEnforceFocus
                maxWidth="md"
                fullScreen={mergedConfig.isFullscreen}
                TransitionComponent={Transition}
                aria-labelledby="dialog-content-editor"
                classes={classes}
                onClose={() => openDialog.current ? openDialog.current() : deleteEditorConfig()}
                onRendered={() => window.focus()}
                {...mergedConfig.dialogProps}
        >
            <ContentEditor mode={mergedConfig.mode}
                           uuid={mergedConfig.uuid}
                           lang={mergedConfig.lang}
                           uilang={mergedConfig.uilang}
                           site={mergedConfig.site}
                           contentType={mergedConfig.contentType}
                           name={mergedConfig.name}
                           count={mergedConfig.count || 0}
                           envProps={envProps}
            />
        </Dialog>
    );
};

ContentEditorModal.propTypes = {
    editorConfig: PropTypes.shape({
        configName: PropTypes.string,
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
