import React from 'react';
import PropTypes from 'prop-types';
import Create from '~/Create/Create';
import Edit from '~/Edit/Edit';
import {EditorIdContextProvider} from './ContentEditorId.context';
import {ContentEditorConfigContext} from './ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import ApolloCacheFlushOnGWTSave from '~/Edit/engineTabs/ApolloCacheFlushOnGWTSave';

const Modes = {
    edit: Edit,
    create: Create
};

export const ContentEditor = ({mode, uuid, lang, uilang, site, contentType, env, envProps}) => {
    const contentEditorConfig = {
        uuid,
        lang,
        uilang,
        site,
        contentType,
        mode,
        env,
        envProps
    };

    const ContentEditorModeCmp = Modes[mode];
    return (
        <EditorIdContextProvider>
            <ApolloCacheFlushOnGWTSave/>

            <ContentEditorConfigContext.Provider value={contentEditorConfig}>
                <DndProvider backend={Backend}>
                    <ContentEditorModeCmp/>
                </DndProvider>
            </ContentEditorConfigContext.Provider>
        </EditorIdContextProvider>
    );
};

ContentEditor.propTypes = {
    mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
    env: PropTypes.oneOf([Constants.env.redux, Constants.env.standalone]).isRequired,
    envProps: PropTypes.object.isRequired,
    uuid: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string
};
