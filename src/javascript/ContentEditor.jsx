import React from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from '@apollo/react-hooks';
import {withApollo} from 'react-apollo';

import {Create} from '~/Create/Create.container';
import {Edit} from '~/Edit/Edit.container';
import {EditorIdContextProvider} from './ContentEditorId.context';

const Routes = {
    edit: Edit,
    create: Create
};

const ContentEditorCmp = ({client, mode}) => {
    const CurrentRouteCmp = Routes[mode];

    return (
        <EditorIdContextProvider>
            <ApolloHooksProvider client={client}>
                <CurrentRouteCmp/>
            </ApolloHooksProvider>
        </EditorIdContextProvider>
    );
};

ContentEditorCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired
};

const ContentEditor = withApollo(ContentEditorCmp);
ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
