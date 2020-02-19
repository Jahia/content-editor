import React, {useState} from 'react';
import {Dialog} from '@material-ui/core';
import ContentEditor from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';

const ContentEditorApi = () => {
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
            <Dialog fullScreen open aria-labelledby="dialog-content-editor">
                <ContentEditor env={Constants.env.standalone}
                               mode={Constants.routes.baseEditRoute}
                               path={edit.path}
                               lang={edit.lang}
                               uilang={edit.uilang}
                               site={edit.site}
                               envProps={envProps}/>
            </Dialog>}

            {create &&
            <Dialog open={create} aria-labelledby="dialog-content-editor">
                <p>create</p>
            </Dialog>}
        </>
    );
};

ContentEditorApi.displayName = 'ContentEditor';
export default ContentEditorApi;
