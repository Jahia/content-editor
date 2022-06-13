import React from 'react';
import PropTypes from 'prop-types';
import {Create} from './Create';
import {CreateFormQuery} from './create.gql-queries';
import {adaptCreateFormData} from './adaptCreateFormData';
import {Edit} from './Edit';
import {EditFormQuery} from './edit.gql-queries';
import {adaptEditFormData} from './adaptEditFormData';
import {ContentEditorConfigContextProvider, ContentEditorContextProvider} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

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
        <ContentEditorConfigContextProvider config={contentEditorConfig}>
            <DndProvider backend={Backend}>
                { mode === 'edit' && (
                    <ContentEditorContextProvider formQuery={EditFormQuery} formDataAdapter={adaptEditFormData}>
                        <Edit/>
                    </ContentEditorContextProvider>
                )}
                { mode === 'create' && (
                    <ContentEditorContextProvider formQuery={CreateFormQuery} formDataAdapter={adaptCreateFormData}>
                        <Create/>
                    </ContentEditorContextProvider>
                )}
            </DndProvider>
        </ContentEditorConfigContextProvider>
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
