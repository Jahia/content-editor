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
        setFormikRef: formik => {
            formikRef.current = formik;
        },
        back: (nodeUuid, operation, newContentUuid, byPassEventTriggers) => {
            if (!byPassEventTriggers) {
                triggerEvents(newContentUuid || nodeUuid, operation);
            }

            setEditorConfig(false);
            closeAll();
        },
        disabledBack: () => false,
        createCallback: (createdNodeUuid, lang) => {
            triggerEvents(createdNodeUuid, Constants.operators.create);

            if (editorConfig && editorConfig.createCallback) {
                editorConfig.createCallback(createdNodeUuid, lang);
            }

            // Redirect to CE edit mode, for the created node
            envProps.isNeedRefresh = false;
            if (editorConfig) {
                setEditorConfig({
                    ...editorConfig,
                    uuid: createdNodeUuid,
                    lang: lang ? lang : editorConfig.lang,
                    mode: Constants.routes.baseEditRoute,
                    fromCreate: true
                });
            }
        },
        editCallback: nodeUuid => {
            if (editorConfig && editorConfig.editCallback) {
                editorConfig.editCallback(nodeUuid);
            }

            // Refresh contentEditorEventHandlers
            triggerEvents(nodeUuid, Constants.operators.update);
        },
        isNeedRefresh: Boolean(editorConfig.fromCreate),
        onClosedCallback: () => {
            if (window.authoringApi.refreshContent && envProps.isNeedRefresh) {
                window.authoringApi.refreshContent();
            }
        },
        setLanguage: lang => {
            // Update the lang of current opened CE
            if (editorConfig) {
                setEditorConfig({
                    ...editorConfig,
                    lang: lang
                });
            }
        },
        shouldRedirectBreadcrumb: () => true,
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
            <ContentEditor env={Constants.env.standalone}
                           mode={editorConfig.mode}
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
