import React from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import {withApollo} from 'react-apollo';

import {Create} from '~Create/Create.container';
import {Edit} from '~Edit/Edit.container';

const Routes = {
    edit: Edit,
    create: Create
};

const ContentEditorCmp = ({client, mode}) => {
    const CurrentRouteCmp = Routes[mode];

    return (
        <ApolloHooksProvider client={client}>
            <CurrentRouteCmp/>
        </ApolloHooksProvider>
    );
};

ContentEditorCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired
};

const ContentEditor = withApollo(ContentEditorCmp);
ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
