import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useApolloClient} from '@apollo/react-hooks';
import {SubscribeToCollaboration} from '~/Collab/collab.gql-subscription';
import {DisconnectUserMutation} from '~/Collab/collab.gql-mutations';

export const CollabManager = ({path}) => {
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
        });

        // Manually unlock when this component is unload.
        // Even if the subscription is still running it will be killed automatically after the server timed out on heartbeat message sending
        return () => {
            client
                .mutate({
                    mutation: DisconnectUserMutation,
                    variables: {
                        nodePath: path
                    }
                })
                .then(() => {
                    // Clear subscription client side. (this will not stop the server side subscription, the server side subscription will end by timeout)
                    subscription.unsubscribe();
                })
                .catch(err => console.error(err));
        };
    }, [client, path]);

    return '';
};

CollabManager.propTypes = {
    path: PropTypes.string.isRequired
};
