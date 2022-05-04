import React, {useRef, useState} from 'react';
import {Constants} from '~/ContentEditor.constants';
import {ContentEditor} from '~/ContentEditor';
import {Dialog} from '@material-ui/core';
import styles from './ContentEditorApi.scss';
import {FormikProvider} from 'formik';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

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
    const needRefresh = useRef(false);

    // Standalone env props
    const envProps = {
        formikRef,
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
        },
        editCallback: ({originalNode, updatedNode}) => {
            needRefresh.current = true;
            if (editorConfig && editorConfig.editCallback) {
                editorConfig.editCallback(updatedNode, originalNode, envProps);
            }

            triggerEvents(updatedNode.uuid, Constants.operators.update);
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
                setEditorConfig(false);
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
            if (editorConfig && editorConfig.onClosedCallback) {
                editorConfig.onClosedCallback(envProps, needRefresh.current);
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
                maxWidth="md"
                fullScreen={editorConfig.isFullscreen}
                TransitionComponent={Transition}
                aria-labelledby="dialog-content-editor"
                classes={classes}
                onClose={() => (formikRef.current && formikRef.current.dirty) ? setConfirmationConfig(true) : setEditorConfig(false)}
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
