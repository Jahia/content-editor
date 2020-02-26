import React, {useState} from 'react';
import {Dialog, withStyles} from '@material-ui/core';
import ContentEditor from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';
import * as PropTypes from 'prop-types';
import Slide from '@material-ui/core/Slide';
import {CreateNewContentDialog} from '../Create/CreateNewContentAction/CreateNewContentDialog';

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

const ContentEditorApiCmp = ({classes}) => {
    const [edit, isEdit] = useState(false);
    const [create, isCreate] = useState(false);

    window.CE_API = window.CE_API || {};
    /**
     * Open content editor as a modal to edit the given node
     * @param path the path of the node to edit
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    window.CE_API.edit = (path, site, lang, uilang) => {
        isEdit({
            path,
            site,
            lang,
            uilang,
            mode: Constants.routes.baseEditRoute
        });
    };

    /**
     * Open content type selection then content editor as a modal to create a new content
     * @param path the parent node path where the content will be created
     * @param site the current site
     * @param lang the current lang from url
     * @param uilang the preferred user lang for ui
     */
    window.CE_API.create = (path, site, lang, uilang) => {
        isCreate({
            path,
            site,
            lang,
            uilang
        });
    };

    // Standalone env props
    const envProps = {
        closeCallback: () => {
            isEdit(false);
            isCreate(false);
        },
        createCallback: createdNodePath => {
            // Redirect to CE edit mode, for the created node
            if (edit) {
                isEdit({
                    path: createdNodePath,
                    site: edit.site,
                    uilang: edit.uilang,
                    lang: edit.lang,
                    mode: Constants.routes.baseEditRoute
                });
            }
        },
        setLanguage: lang => {
            // Update the lang of current opened CE
            if (edit) {
                isEdit({
                    path: edit.path,
                    site: edit.site,
                    uilang: edit.uilang,
                    lang: lang,
                    mode: edit.mode,
                    contentType: edit.contentType
                });
            }
        }
    };

    return (
        <>
            {edit &&
            <Dialog fullScreen open TransitionComponent={Transition} aria-labelledby="dialog-content-editor" classes={{root: classes.ceDialogRoot}} onClose={envProps.closeCallback}>
                <div className={classes.mainBackground}>
                    <ContentEditor env={Constants.env.standalone}
                                   mode={edit.mode}
                                   path={edit.path}
                                   lang={edit.lang}
                                   uilang={edit.uilang}
                                   site={edit.site}
                                   contentType={edit.contentType}
                                   envProps={envProps}
                    />
                </div>
            </Dialog>}

            {create &&
            <CreateNewContentDialog
                open
                parentPath={create.path}
                uilang={create.uilang}
                onClose={() => {
                    isCreate(false);
                }}
                onExited={() => {
                    isCreate(false);
                }}
                onCreateContent={contentType => {
                    isCreate(false);
                    isEdit({
                        path: create.path,
                        site: create.site,
                        uilang: create.uilang,
                        lang: create.lang,
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
    classes: PropTypes.object.isRequired
};

const ContentEditorApi = withStyles(styles)(ContentEditorApiCmp);
ContentEditorApi.displayName = 'ContentEditorAPI';
export default ContentEditorApi;
