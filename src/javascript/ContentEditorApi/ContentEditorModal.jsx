import React, {useEffect, useRef} from 'react';
import {Constants} from '~/ContentEditor.constants';
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
import {ContentEditorConfigContextProvider, ContentEditorContextProvider} from '~/contexts';
import {Edit} from '~/ContentEditor/Edit';
import {Create} from '~/ContentEditor/Create';

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

export const ContentEditorModal = ({editorConfig, updateEditorConfig, onExited}) => {
    const notificationContext = useNotifications();

    const needRefresh = useRef(false);
    const confirmationDialog = useRef();
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

    const {createCallback, editCallback, onClosedCallback} = mergedConfig;

    mergedConfig.updateEditorConfig = updateEditorConfig;
    mergedConfig.createCallback = ({newNode}) => {
        needRefresh.current = true;
        if (createCallback) {
            createCallback(newNode, mergedConfig);
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
    };

    mergedConfig.editCallback = ({originalNode, updatedNode}) => {
        needRefresh.current = true;
        if (editCallback) {
            editCallback(updatedNode, originalNode, mergedConfig);
        }

        triggerEvents(updatedNode.uuid, Constants.operators.update);

        notificationContext.notify(t('content-editor:label.contentEditor.edit.action.save.success'), ['closeButton'], {autoHideDuration: 3000});
    };

    mergedConfig.onSavedCallback = ({newNode, language, originalNode, updatedNode}, forceRedirect) => {
        if (newNode && (mergedConfig.isFullscreen || forceRedirect)) {
            // Redirect to CE edit mode, for the created node
            needRefresh.current = false;
            updateEditorConfig({
                uuid: newNode.uuid,
                lang: language ? language : mergedConfig.lang,
                mode: Constants.routes.baseEditRoute
            });
        } else if (!mergedConfig.isFullscreen) {
            if (newNode) {
                Promise.all(window.contentModificationEventHandlers.map(handler => handler(newNode.uuid, newNode.path, newNode.path.split('/').pop(), 'update'))).then(() => {
                    // Otherwise refresh and close
                    updateEditorConfig({closed: true});
                });
            } else if (originalNode.path === updatedNode.path) {
                updateEditorConfig({closed: true});
            } else {
                client.cache.flushNodeEntryByPath(originalNode.path);
                Promise.all(window.contentModificationEventHandlers.map(handler => handler(updatedNode.uuid, originalNode.path, updatedNode.path.split('/').pop(), 'update'))).then(() => {
                    // Otherwise refresh and close
                    updateEditorConfig({closed: true});
                });
            }
        }
    };

    mergedConfig.onClosedCallback = () => {
        if (onClosedCallback) {
            onClosedCallback(mergedConfig, needRefresh.current);
        }
    };

    mergedConfig.layout = mergedConfig.layout || (mergedConfig.isFullscreen ? EditPanelFullscreen : EditPanelCompact);
    mergedConfig.confirmationDialog = <OnCloseConfirmationDialog ref={confirmationDialog}/>;
    mergedConfig.formKey = mergedConfig.formKey || 'modal';

    mergedConfig.count = mergedConfig.count || 0;

    // This is the only sure way to tell when content editor is no longer visible
    useEffect(() => {
        return () => {
            dispatch(ceToggleSections({key: mergedConfig.formKey, sections: null}));
        };
    }, [dispatch, mergedConfig.formKey]);

    const classes = mergedConfig.isFullscreen ? {
        root: styles.ceDialogRootFullscreen
    } : {
        paper: styles.ceDialogContent
    };

    const useFormDefinition = mergedConfig.useFormDefinition || (mergedConfig.mode === 'edit' ? useEditFormDefinition : useCreateFormDefinition);

    return (
        <Dialog disableAutoFocus
                disableEnforceFocus
                open={!editorConfig.closed}
                maxWidth="md"
                fullScreen={mergedConfig.isFullscreen}
                TransitionComponent={Transition}
                aria-labelledby="dialog-content-editor"
                classes={classes}
                onClose={() => confirmationDialog.current ? confirmationDialog.current.openDialog() : updateEditorConfig({closed: true})}
                onExited={onExited}
                onRendered={() => window.focus()}
                {...mergedConfig.dialogProps}
        >
            <ContentEditorConfigContextProvider config={mergedConfig}>
                <ContentEditorContextProvider useFormDefinition={useFormDefinition}>
                    {mergedConfig.mode === 'edit' ? <Edit/> : <Create/>}
                </ContentEditorContextProvider>
            </ContentEditorConfigContextProvider>
        </Dialog>
    );
};

ContentEditorModal.propTypes = {
    editorConfig: PropTypes.shape({
        configName: PropTypes.string,
        mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
        uuid: PropTypes.string,
        lang: PropTypes.string,
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
        useConfirmationDialog: PropTypes.bool,
        closed: PropTypes.bool,
        onExited: PropTypes.func
    }).isRequired,
    updateEditorConfig: PropTypes.func.isRequired,
    onExited: PropTypes.func.isRequired
};
