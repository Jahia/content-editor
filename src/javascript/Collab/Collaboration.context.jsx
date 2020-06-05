import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SubscribeToCollaboration} from '~/Collab/collab.gql-subscription';
import {DisconnectUserMutation} from '~/Collab/collab.gql-mutations';
import {useApolloClient} from '@apollo/react-hooks';

export const CollaborationContext = React.createContext({});

export const useCollaborationContext = () => useContext(CollaborationContext);

export const CollaborationContextProvider = ({path, children}) => {
    const [collaborationData, setCollaborationData] = useState({});
    const client = useApolloClient();

    useEffect(() => {
        const subscriptionObserver = client.subscribe({
            query: SubscribeToCollaboration,
            variables: {
                nodePath: path
            },
            shouldResubscribe: true
        });

        const subscription = subscriptionObserver.subscribe(data => {
            console.log(data);
            setCollaborationData(data);
        });

        // Manually disconnect the user
        return () => {
            client
                .mutate({
                    mutation: DisconnectUserMutation,
                    variables: {
                        nodePath: path
                    }
                })
                .then(() => {
                    subscription.unsubscribe();
                })
                .catch(err => console.error(err));
        };
    }, [client, path, setCollaborationData]);

    return (
        <CollaborationContext.Provider value={collaborationData}>
            {children}
        </CollaborationContext.Provider>
    );
};

CollaborationContextProvider.propTypes = {
    path: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
