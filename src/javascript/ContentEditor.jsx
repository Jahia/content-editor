import React from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
import Create from '~/Create/Create';
import Edit from '~/Edit/Edit';
import {EditorIdContextProvider} from './ContentEditorId.context';
import {withApollo} from 'react-apollo';
import {ContentEditorConfigContext} from './ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import {DndProvider} from 'react-dnd';
import Backend from 'react-dnd-html5-backend';

const Modes = {
    edit: Edit,
    create: Create
};

const ContentEditorCmp = ({mode, path, lang, uilang, site, contentType, client, env, envProps}) => {
    const contentEditorConfig = {
        path,
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
            <ApolloHooksProvider client={client}>
                <ContentEditorConfigContext.Provider value={contentEditorConfig}>
                    <DndProvider backend={Backend}>
                        <ContentEditorModeCmp/>
                    </DndProvider>
                </ContentEditorConfigContext.Provider>
            </ApolloHooksProvider>
        </EditorIdContextProvider>
    );
};

ContentEditorCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf([Constants.routes.baseCreateRoute, Constants.routes.baseEditRoute]).isRequired,
    env: PropTypes.oneOf([Constants.env.redux, Constants.env.standalone]).isRequired,
    envProps: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string
};

export const ContentEditor = withApollo(ContentEditorCmp);
ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
