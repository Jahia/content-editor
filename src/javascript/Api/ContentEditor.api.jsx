import React, {useState} from 'react';
import {Dialog, withStyles} from '@material-ui/core';
import ContentEditor from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';
import * as PropTypes from 'prop-types';

let styles = () => {
    return {
        mainBackground: {
            // Color from DX core anthracite, not in the theme
            backgroundColor: '#363636'
        },
        ceDialogRoot: {
            // Reduce zIndex to be able to display the old edit engine tabs
            zIndex: 1000
        }
    };
};

const ContentEditorApiCmp = ({classes}) => {
    const [edit, isEdit] = useState(false);
    const [create, isCreate] = useState(false);

    window.CE_API = window.CE_API || {};
    window.CE_API.edit = (path, site, lang, uilang) => {
        isEdit({
            path,
            site,
            lang,
            uilang
        });
    };

    window.CE_API.create = () => {
        isCreate(true);
    };

    // Standalone env props
    const envProps = {
        closeCallback: () => {
            isEdit(false);
            isCreate(false);
        },
        setLanguage: lang => {
            if (edit) {
                isEdit({
                    path: edit.path,
                    site: edit.site,
                    uilang: edit.uilang,
                    lang: lang
                });
            }

            if (create) {
                // TODO BACKLOG-12172: handle create
            }
        }
    };

    return (
        <>
            {edit &&
            <Dialog fullScreen open aria-labelledby="dialog-content-editor" classes={{root: classes.ceDialogRoot}}>
                <div className={classes.mainBackground}>
                    <ContentEditor env={Constants.env.standalone}
                                   mode={Constants.routes.baseEditRoute}
                                   path={edit.path}
                                   lang={edit.lang}
                                   uilang={edit.uilang}
                                   site={edit.site}
                                   envProps={envProps}
                    />
                </div>
            </Dialog>}

            {create &&
            <Dialog open={create} aria-labelledby="dialog-content-editor">
                <p>create</p>
            </Dialog>}
        </>
    );
};

ContentEditorApiCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

const ContentEditorApi = withStyles(styles)(ContentEditorApiCmp);
ContentEditorApi.displayName = 'ContentEditorAPI';
export default ContentEditorApi;
