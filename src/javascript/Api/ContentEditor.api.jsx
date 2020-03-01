import React, {useState} from 'react';
import {Dialog, withStyles} from '@material-ui/core';
import ContentEditor from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';
import * as PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import {CreateNewContentDialog} from '../Create/CreateNewContentAction/CreateNewContentDialog';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {getCreatableNodetypes} from '~/Create/CreateNewContentAction/createNewContent.utits';

let styles = () => {
    return {
        mainBackground: {
            // Color from DX core anthracite, not in the theme
            backgroundColor: '#363636'
        },
        ceDialogRoot: {
            // Reduce zIndex to be able to display the old edit engine tabs
            zIndex: 1000,
            width: 'calc(100vw - 56px)',
            left: 'unset',
            right: 0
        }
    };
};

const ContentEditorApiCmp = ({classes, client}) => {
    const [editorConfig, setEditorConfig] = useState(false);
    const [contentTypeSelectorConfig, setContentTypeSelectorConfig] = useState(false);

    window.CE_API = window.CE_API || {};
    /**
     * Open content editor as a modal to edit the given node
     * @param path the path of the node to edit
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    window.CE_API.edit = (path, site, lang, uilang) => {
        setEditorConfig({path, site, lang, uilang, mode: Constants.routes.baseEditRoute});
    };

    /**
     * Open content type selection then content editor as a modal to create a new content
     * @param path the parent node path where the content will be created
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     * @param nodeTypes (optional) required in case you want to open CE directly for this content type,
     *                    if not specified: will try to resolve the content types available for creation
     *                    - in case of one content type resolved and includeSubTypes to false: open directly CE for this content type
     *                    - in case of multiple content types resolved: open content type selector
     * @param excludedNodeTypes (optional) The node types excluded for creation, by default: ['jmix:studioOnly', 'jmix:hiddenType']
     * @param includeSubTypes (optional) if true, subtypes of nodeTypes provided will be resolved.
     */
    window.CE_API.create = (path, site, lang, uilang, nodeTypes, excludedNodeTypes, includeSubTypes) => {
        if (nodeTypes && nodeTypes.length === 1 && !includeSubTypes) {
            // Direct create with a known content type
            setEditorConfig({path, site, lang, uilang, contentType: nodeTypes[0], mode: Constants.routes.baseCreateRoute});
        } else {
            getCreatableNodetypes(
                client,
                nodeTypes,
                includeSubTypes,
                path,
                uilang,
                (excludedNodeTypes && excludedNodeTypes.length) > 0 ? excludedNodeTypes : ['jmix:studioOnly', 'jmix:hiddenType'],
                [],
                creatableNodeTypes => {
                    // Only one type allowed, open directly CE
                    if (creatableNodeTypes.length === 1) {
                        setEditorConfig({
                            path,
                            site,
                            lang,
                            uilang,
                            contentType: creatableNodeTypes[0].name,
                            mode: Constants.routes.baseCreateRoute
                        });
                    }

                    // Multiple nodetypes allowed, open content type selector
                    if (creatableNodeTypes.length > 1) {
                        setContentTypeSelectorConfig({
                            creatableNodeTypes: creatableNodeTypes.map(nodeType => nodeType.name),
                            includeSubTypes,
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

    // Standalone env props
    const envProps = {
        closeCallback: () => {
            setEditorConfig(false);
            setContentTypeSelectorConfig(false);
        },
        createCallback: createdNodePath => {
            // Refresh GWT content
            if (window.top.authoringApi.refreshContent) {
                window.top.authoringApi.refreshContent();
            }

            // Redirect to CE edit mode, for the created node
            if (editorConfig) {
                setEditorConfig({
                    path: createdNodePath,
                    site: editorConfig.site,
                    uilang: editorConfig.uilang,
                    lang: editorConfig.lang,
                    mode: Constants.routes.baseEditRoute
                });
            }
        },
        editCallback: () => {
            // Refresh GWT content
            if (window.top.authoringApi.refreshContent) {
                window.top.authoringApi.refreshContent();
            }
        },
        setLanguage: lang => {
            // Update the lang of current opened CE
            if (editorConfig) {
                setEditorConfig({
                    path: editorConfig.path,
                    site: editorConfig.site,
                    uilang: editorConfig.uilang,
                    lang: lang,
                    mode: editorConfig.mode,
                    contentType: editorConfig.contentType
                });
            }
        }
    };

    return (
        <>
            {editorConfig &&
            <Dialog fullScreen
                    open
                    TransitionComponent={Transition}
                    TransitionProps={{tabIndex: ''}} // Hack for CKEditor pickers fields to be editable
                    aria-labelledby="dialog-content-editor"
                    classes={{root: classes.ceDialogRoot}}
                    onClose={envProps.closeCallback}
            >
                <div className={classes.mainBackground}>
                    <ContentEditor env={Constants.env.standalone}
                                   mode={editorConfig.mode}
                                   path={editorConfig.path}
                                   lang={editorConfig.lang}
                                   uilang={editorConfig.uilang}
                                   site={editorConfig.site}
                                   contentType={editorConfig.contentType}
                                   envProps={envProps}
                    />
                </div>
            </Dialog>}

            {contentTypeSelectorConfig &&
            <CreateNewContentDialog
                open
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
                        path: contentTypeSelectorConfig.path,
                        site: contentTypeSelectorConfig.site,
                        uilang: contentTypeSelectorConfig.uilang,
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
