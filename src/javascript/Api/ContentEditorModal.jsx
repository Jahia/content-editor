import React, {useRef, useState} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog} from '@material-ui/core';
import styles from './ContentEditorApi.scss';
import {FormikProvider} from 'formik';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import {pcNavigateTo} from '~/pagecomposer.redux-actions';
import {useDispatch} from 'react-redux';

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
    const [confirmationConfig, setConfirmationConfig] = useState(false);

    const formikRef = useRef();
    const dispatch = useDispatch();
    const needRefresh = useRef(false);

    const closeAll = () => {
        // Restore GWT language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(editorConfig.initLang);
        }

        setEditorConfig(false);
    };

    // Standalone env props
    const envProps = {
        formikRef,
        back: () => {
            closeAll();
        },
        disabledBack: () => false,
        createCallback: ({newNode}) => {
            needRefresh.current = true;
            triggerEvents(newNode.uuid, Constants.operators.create);
        },
        editCallback: ({originalNode, updatedNode}) => {
            needRefresh.current = true;
            // Refresh contentEditorEventHandlers
            triggerEvents(updatedNode.uuid, Constants.operators.update);

            // Trigger Page Composer to reload iframe if system name was renamed
            if (originalNode.path !== updatedNode.path) {
                dispatch(pcNavigateTo({oldPath: originalNode.path, newPath: updatedNode.path}));
            }
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
                        mode: Constants.routes.baseEditRoute,
                        fromCreate: true
                    });
                }
            } else if (!editorConfig.isFullscreen) {
                // Otherwise refresh and close
                closeAll();
            }
        },
        switchLanguageCallback: ({newNode, language}) => {
            if (newNode) {
                envProps.onSavedCallback({newNode, language}, true);
            } else if (editorConfig) {
                // Update the lang of current opened CE
                setEditorConfig({
                    ...editorConfig,
                    lang: language
                });
            }
        },
        onClosedCallback: () => {
            if (window.authoringApi.refreshContent && needRefresh.current) {
                window.authoringApi.refreshContent();
            }
        },
        redirectBreadcrumbCallback: () => {
            envProps.back();
        },
        isModal: true,
        isFullscreen: editorConfig?.isFullscreen
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
                fullScreen={editorConfig.isFullscreen}
                TransitionComponent={Transition}
                aria-labelledby="dialog-content-editor"
                classes={classes}
                onClose={() => (formikRef.current && formikRef.current.dirty) ? setConfirmationConfig(true) : closeAll()}
                onRendered={() => window.focus()}
        >
            {confirmationConfig && (
                <FormikProvider value={formikRef.current}>
                    <EditPanelDialogConfirmation
                        isOpen={open}
                        actionCallback={envProps.back}
                        onCloseDialog={() => setConfirmationConfig(false)}
                    />
                </FormikProvider>
            )}
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
