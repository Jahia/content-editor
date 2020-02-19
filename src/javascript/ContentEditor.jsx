import React from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
import Create from '~/Create/Create';
import Edit from '~/Edit/Edit';
import {EditorIdContextProvider} from './ContentEditorId.context';
import {withApollo} from 'react-apollo';
import {ContentEditorConfigContext} from './ContentEditor.context';

const Modes = {
    edit: Edit,
    create: Create
};

const ContentEditorCmp = ({mode, path, lang, uilang, site, contentType, client, setUrl, createCallback, closeCallback}) => {
    const contentEditorConfig = {
        path,
        lang,
        uilang,
        site,
        contentType,
        mode,
        setUrl,
        createCallback,
        closeCallback
    };

    const ContentEditorModeCmp = Modes[mode];
    return (
        <EditorIdContextProvider>
            <ApolloHooksProvider client={client}>
                <ContentEditorConfigContext.Provider value={contentEditorConfig}>
                    <ContentEditorModeCmp/>
                </ContentEditorConfigContext.Provider>
            </ApolloHooksProvider>
        </EditorIdContextProvider>
    );
};

ContentEditorCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    uilang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    contentType: PropTypes.string,
    setUrl: PropTypes.func,
    createCallback: PropTypes.func,
    closeCallback: PropTypes.func
};

export const ContentEditor = withApollo(ContentEditorCmp);
ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
