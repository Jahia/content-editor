import React from 'react';
import PropTypes from 'prop-types';
import Create from './Create/Create';
import Edit from './Edit/Edit';
import {ContentEditorConfigContext, ContentEditorDataContextProvider} from './ContentEditor.context';
import {Constants} from './ContentEditor.constants';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import {EditFormQuery} from './Edit/edit.gql-queries';
import {adaptEditFormData} from './Edit/Edit.adapter';
import {CreateFormQuery} from './Create/create.gql-queries';
import {adaptCreateFormData} from './Create/Create.adapter';

export const ContentEditor = ({name, mode, uuid, lang, uilang, site, contentType, envProps}) => {
    const contentEditorConfig = {
        name,
        uuid,
        lang,
        uilang,
        site,
        contentType,
        mode,
        envProps
    };

    return (
        <ContentEditorConfigContext.Provider value={contentEditorConfig}>
            <DndProvider backend={Backend}>
                { mode === 'edit' && (
                    <ContentEditorDataContextProvider formQuery={EditFormQuery} formDataAdapter={adaptEditFormData}>
                        <Edit/>
                    </ContentEditorDataContextProvider>
                )}
                { mode === 'create' && (
                    <ContentEditorDataContextProvider formQuery={CreateFormQuery} formDataAdapter={adaptCreateFormData}>
                        <Create/>
                    </ContentEditorDataContextProvider>
                )}
            </DndProvider>
        </ContentEditorConfigContext.Provider>
    );
};

ContentEditor.propTypes = {
    mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
    envProps: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string,
    name: PropTypes.string
};
