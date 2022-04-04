import React, {useCallback, useRef, useState} from 'react';
import {Dialog, withStyles} from '@material-ui/core';
import {ContentEditor} from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';
import * as PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import {CreateNewContentDialog} from '../Create/CreateNewContentAction/CreateNewContentDialog';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {getCreatableNodetypes} from '~/Create/CreateNewContentAction/createNewContent.utils';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';
import {ErrorBoundary} from '@jahia/jahia-ui-root';
import Draggable from 'react-draggable';
import {FormikProvider} from 'formik';

let styles = () => {
    return {
        ceDialogRoot: {
            // Reduce zIndex to be able to display the old edit engine tabs
            zIndex: 1031,
            width: 'calc(100vw - 56px)',
            left: 'unset',
            right: 0
        },
        ceWindowRoot: {
            zIndex: 1500,
            opacity: 1,
            width: '40vw',
            minWidth: '620px',
            height: 'calc(100vh - 124px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            boxShadow: '0 4px 8px var(--color-dark40)',
            right: 0,
            bottom: 0
        }
    };
};

function triggerEvents(nodeUuid, operator) {
// Refresh contentEditorEventHandlers
    if (window.top.contentEditorEventHandlers && Object.keys(window.top.contentEditorEventHandlers).length > 0) {
        Object.values(window.top.contentEditorEventHandlers)
            .forEach(handler =>
                handler({nodeUuid: nodeUuid, operator: operator})
            );
    }
}

const FullScreenError = props => {
    return (
        <div style={{height: '100vh', display: 'flex'}}>
            {React.cloneElement(ErrorBoundary.defaultProps.fallback, props)}
        </div>
    );
};

const ContentEditorApiCmp = ({classes, client}) => {
    const [editorConfig, setEditorConfig] = useState(false);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState(false);
    const formikRef = useRef();

    window.CE_API = window.CE_API || {};
    /**
     * Open content editor as a modal to edit the given node
     * @param uuid the uuid of the node to edit
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    window.CE_API.edit = useCallback((uuid, site, lang, uilang, isWindow, editCallback) => {
        // Sync GWT language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(lang);
        }

        setEditorConfig({
            uuid,
            site,
            lang,
            uilang,
            initLang: lang,
            mode: Constants.routes.baseEditRoute,
            isWindow,
            editCallback
        });
    }, []);

    /**
     * Open content type selection then content editor as a modal to create a new content
     * @param uuid of the parent node path where the content will be created
     * @param path of the parent node path where the content will be created
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     * @param nodeTypes (optional) required in case you want to open CE directly for this content type,
     *                    if not specified: will try to resolve the content types available for creation
     *                    - in case of one content type resolved and includeSubTypes to false: open directly CE for this content type
     *                    - in case of multiple content types resolved: open content type selector
     * @param excludedNodeTypes (optional) The node types excluded for creation, by default: ['jmix:studioOnly', 'jmix:hiddenType']
     * @param includeSubTypes (optional) if true, subtypes of nodeTypes provided will be resolved.
     * @param name the name of the child node (only specified in case of named child node, null/undefined otherwise)
     */
    // eslint-disable-next-line
    window.CE_API.create = (uuid, path, site, lang, uilang, nodeTypes, excludedNodeTypes, includeSubTypes, name) => {
        // Sync GWT language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(lang);
        }

        getCreatableNodetypes(
            client,
            nodeTypes,
            name,
            includeSubTypes,
            path,
            uilang,
            (excludedNodeTypes && excludedNodeTypes.length) > 0 ? excludedNodeTypes : ['jmix:studioOnly', 'jmix:hiddenType'],
            [],
            creatableNodeTypes => {
                // Only one type allowed, open directly CE
                if (creatableNodeTypes.length === 1) {
                    setEditorConfig({
                        name,
                        uuid,
                        site,
                        lang,
                        uilang,
                        initLang: lang,
                        contentType: creatableNodeTypes[0].name,
                        mode: Constants.routes.baseCreateRoute
                    });
                }

                // Multiple nodetypes allowed, open content type selector
                if (creatableNodeTypes.length > 1) {
                    setContentTypeSelectorConfig({
                        creatableNodeTypes: creatableNodeTypes.map(nodeType => nodeType.name),
                        includeSubTypes,
                        name,
                        uuid,
                        path,
                        site,
                        lang,
                        uilang
                    });
                }
            }
        );
    };

    const closeAll = () => {
        // Restore GWT language
        if (window.authoringApi.switchLanguage) {
            window.authoringApi.switchLanguage(editorConfig.initLang);
        }

        setEditorConfig(false);
        setContentTypeSelectorConfig(false);
    };

    // Standalone env props
    const envProps = {
        formikRef,
        setFormikRef: formik => {
            formikRef.current = formik;
        },
        back: (nodeUuid, operation, newContentUuid, byPassEventTriggers) => {
            // Refresh GWT content
            if (window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }

            if (!byPassEventTriggers) {
                triggerEvents(newContentUuid || nodeUuid, operation);
            }

            setEditorConfig(false);
            closeAll();
        },
        disabledBack: () => false,
        createCallback: (createdNodeUuid, lang) => {
            // Refresh GWT content
            if (window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }

            triggerEvents(createdNodeUuid, Constants.operators.create);

            if (editorConfig && editorConfig.createCallback) {
                editorConfig.createCallback(createdNodeUuid, lang);
            }

            // Redirect to CE edit mode, for the created node
            if (editorConfig) {
                setEditorConfig({
                    ...editorConfig,
                    uuid: createdNodeUuid,
                    lang: lang ? lang : editorConfig.lang,
                    mode: Constants.routes.baseEditRoute
                });
            }
        },
        editCallback: nodeUuid => {
            // Refresh GWT content
            if (window.authoringApi.refreshContent) {
                window.authoringApi.refreshContent();
            }

            if (editorConfig && editorConfig.editCallback) {
                editorConfig.editCallback(nodeUuid);
            }

            // Refresh contentEditorEventHandlers
            triggerEvents(nodeUuid, Constants.operators.update);
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
        isWindow: editorConfig?.isWindow
    };

    let contentEditor = editorConfig && (
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
    );
    return (
        <ErrorBoundary fallback={<FullScreenError/>}>
            {editorConfig && !editorConfig.isWindow && (
                <Dialog fullScreen
                        open
                        disableAutoFocus
                        disableEnforceFocus
                        TransitionComponent={Transition}
                        aria-labelledby="dialog-content-editor"
                        classes={{root: classes.ceDialogRoot}}
                        onClose={() => (formikRef.current && formikRef.current.dirty) ? setConfirmationConfig(true) : closeAll()}
                >
                    {confirmationConfig && (
                        <FormikProvider value={formikRef.current}>
                            <EditPanelDialogConfirmation
                                isOpen={open}
                                titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                                actionCallback={envProps.back}
                                onCloseDialog={() => setConfirmationConfig(false)}
                            />
                        </FormikProvider>
                    )}
                    {contentEditor}
                </Dialog>
            )}

            {editorConfig && editorConfig.isWindow && (
                <Draggable defaultPosition={{x: 0, y: 0}} handle="header">
                    <div className={classes.ceWindowRoot}>
                        {contentEditor}
                    </div>
                </Draggable>
            )}

            {contentTypeSelectorConfig && (
                <CreateNewContentDialog
                    open
                    childNodeName={contentTypeSelectorConfig.name}
                    nodeTypes={contentTypeSelectorConfig.creatableNodeTypes}
                    includeSubTypes={contentTypeSelectorConfig.includeSubTypes}
                    parentPath={contentTypeSelectorConfig.path}
                    uilang={contentTypeSelectorConfig.uilang}
                    onClose={() => {
                        setContentTypeSelectorConfig(false);
                    }}
                    onExited={() => {
                        setContentTypeSelectorConfig(false);
                    }}
                    onCreateContent={contentType => {
                        setContentTypeSelectorConfig(false);
                        setEditorConfig({
                            name: contentTypeSelectorConfig.name,
                            uuid: contentTypeSelectorConfig.uuid,
                            site: contentTypeSelectorConfig.site,
                            uilang: contentTypeSelectorConfig.uilang,
                            initLang: contentTypeSelectorConfig.lang,
                            lang: contentTypeSelectorConfig.lang,
                            contentType: contentType.name,
                            mode: Constants.routes.baseCreateRoute
                        });
                    }}
                />
            )}
        </ErrorBoundary>
    );
};

const Transition = React.forwardRef((props, ref) => {
    return <Slide ref={ref} direction="up" {...props}/>;
});

ContentEditorApiCmp.propTypes = {
    client: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

const ContentEditorApi = compose(
    withApollo,
    withStyles(styles)
)(ContentEditorApiCmp);

ContentEditorApi.displayName = 'ContentEditorAPI';
export default ContentEditorApi;
