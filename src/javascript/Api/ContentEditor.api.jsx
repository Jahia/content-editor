import React, {useState} from 'react';
import {Dialog, withStyles} from '@material-ui/core';
import {ContentEditor} from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';
import * as PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import {CreateNewContentDialog} from '../Create/CreateNewContentAction/CreateNewContentDialog';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {getCreatableNodetypes} from '~/Create/CreateNewContentAction/createNewContent.utits';
import EditPanelDialogConfirmation from '~/EditPanel/EditPanelDialogConfirmation/EditPanelDialogConfirmation';

let styles = () => {
    return {
        ceDialogRoot: {
            // Reduce zIndex to be able to display the old edit engine tabs
            zIndex: 1031,
            width: 'calc(100vw - 56px)',
            left: 'unset',
            right: 0
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

const ContentEditorApiCmp = ({classes, client}) => {
    const [editorConfig, setEditorConfig] = useState(false);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);
    const [confirmationConfig, setConfirmationConfig] = useState(false);
    const [formikRef, setFormikRef] = useState(false);

    window.CE_API = window.CE_API || {};
    /**
     * Open content editor as a modal to edit the given node
     * @param uuid the uuid of the node to edit
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    window.CE_API.edit = (uuid, site, lang, uilang) => {
        // Sync GWT language
        if (window.top.authoringApi.switchLanguage) {
            window.top.authoringApi.switchLanguage(lang);
        }

        setEditorConfig({uuid, site, lang, uilang, initLang: lang, mode: Constants.routes.baseEditRoute});
    };

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
        if (window.top.authoringApi.switchLanguage) {
            window.top.authoringApi.switchLanguage(lang);
        }

        if (nodeTypes && nodeTypes.length === 1 && !includeSubTypes) {
            // Direct create with a known content type
            setEditorConfig({
                name,
                uuid,
                site,
                lang,
                uilang,
                initLang: lang,
                contentType: nodeTypes[0],
                mode: Constants.routes.baseCreateRoute
            });
        } else {
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
        }
    };

    const closeAll = () => {
        // Restore GWT language
        if (window.top.authoringApi.switchLanguage) {
            window.top.authoringApi.switchLanguage(editorConfig.initLang);
        }

        setEditorConfig(false);
        setContentTypeSelectorConfig(false);
    };

    // Standalone env props
    const envProps = {
        initCallback: formik => {
            setFormikRef(formik);
        },
        back: (nodeUuid, operation) => {
            // Refresh GWT content
            if (window.top.authoringApi.refreshContent) {
                window.top.authoringApi.refreshContent();
            }

            triggerEvents(nodeUuid, operation);

            closeAll();
        },
        disabledBack: () => false,
        createCallback: (createdNodeUuid, lang) => {
            // Refresh GWT content
            if (window.top.authoringApi.refreshContent) {
                window.top.authoringApi.refreshContent();
            }

            triggerEvents(createdNodeUuid, Constants.operators.create);

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
            if (window.top.authoringApi.refreshContent) {
                window.top.authoringApi.refreshContent();
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
        shouldRedirectBeadCrumb: () => true
    };

    return (
        <>
            {editorConfig &&
            <Dialog fullScreen
                    open
                    TransitionComponent={Transition}
                    aria-labelledby="dialog-content-editor"
                    classes={{root: classes.ceDialogRoot}}
                    disableAutoFocus="true"
                    disableEnforceFocus="true"
                    onClose={() => (formikRef && formikRef.dirty) ? setConfirmationConfig(true) : closeAll()}
            >
                {confirmationConfig && <EditPanelDialogConfirmation
                    open
                    titleKey="content-editor:label.contentEditor.edit.action.goBack.title"
                    formik={formikRef}
                    actionCallback={envProps.back}
                    onCloseDialog={() => setConfirmationConfig(false)}
                />}

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
            </Dialog>}

            {contentTypeSelectorConfig &&
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
            />}
        </>
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
