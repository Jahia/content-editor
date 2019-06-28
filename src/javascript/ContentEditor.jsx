import React from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import EditPanelContainer from './EditPanelContainer';
import {withApollo} from 'react-apollo';

const ContentEditor = ({client}) => {
    return (
        <ApolloHooksProvider client={client}>
            <EditPanelContainer/>
        </ApolloHooksProvider>
    );
};

ContentEditor.propTypes = {
    client: PropTypes.object.isRequired
};

export default withApollo(ContentEditor);
