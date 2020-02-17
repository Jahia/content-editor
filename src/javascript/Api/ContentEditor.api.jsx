import React, {useState} from 'react';
import {Dialog} from '@material-ui/core';

// Todo BACKLOG-12406: expose fct to open CE
const ContentEditorApi = () => {
    const [edit, isEdit] = useState(false);
    const [create, isCreate] = useState(false);

    window.CE_API = window.CE_API || {};
    window.CE_API.edit = () => {
        isEdit(true);
    };

    window.CE_API.create = () => {
        isCreate(true);
    };

    return (
        <>
            {edit &&
            <Dialog open={edit} aria-labelledby="dialog-content-editor">
                <p>edit</p>
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
