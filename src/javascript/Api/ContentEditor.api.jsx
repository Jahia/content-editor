import React, {useState} from 'react';
import {Dialog} from '@material-ui/core';
import ContentEditor from '~/ContentEditor';
import {Constants} from '~/ContentEditor.constants';

// Todo BACKLOG-12406: expose fct to open CE
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

    const closeCallback = () => {
        isEdit(false);
        isCreate(false);
    };

    return (
        <>
            {edit &&
            <Dialog fullScreen open aria-labelledby="dialog-content-editor">
                <ContentEditor mode={Constants.routes.baseEditRoute}
                               path={edit.path}
                               lang={edit.lang}
                               uilang={edit.uilang}
                               site={edit.site}
                               closeCallback={closeCallback}/>
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
