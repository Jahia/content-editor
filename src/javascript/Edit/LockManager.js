import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useApolloClient} from '@apollo/react-hooks';
import {SubscribeToEditorLock} from './lock.gql-subscription';
import {UnlockEditorMutation} from './lock.gql-mutation';

export const LockManager = ({uuid, onLockReleased}) => {
    const client = useApolloClient();

    useEffect(() => {
        // Generate random id to hold the lock server side for current editor
        const editorId = '_' + Math.random().toString(36).substr(2, 9);

        // Lock and subscribe to ping the server we are editing,
        // The subscription is used in case the browser is closed or crashed, to unlock automatically the node.
        // The server is sending heartbeat messages through this subscription, in case the subscription is closed client side (browser closed, crashed, etc)
        // Then the node will be automatically unlocked by the server after a few seconds.
        const subscriptionObserver = client.subscribe({
            query: SubscribeToEditorLock,
            variables: {
                nodeId: uuid,
                editorID: editorId
            },
            shouldResubscribe: true
        });

        const subscription = subscriptionObserver.subscribe(() => {/* Nothing to do on heartbeat messages */});

        // Manually unlock when this component is unload.
        // Even if the subscription is still running it will be killed automatically after the server timed out on heartbeat message sending
        return () => {
            client
                .mutate({
                    mutation: UnlockEditorMutation,
                    variables: {
                        editorID: editorId
                    }
                })
                .then(() => {
                    // Clear subscription client side. (this will not stop the server side subscription, the server side subscription will end by timeout)
                    subscription.unsubscribe();

                    // Manual refetch to avoid node displayed as locked in other apps like (Jcontent)
                    client.reFetchObservableQueries();

                    if (onLockReleased) {
                        onLockReleased();
                    }
                })
                .catch(err => console.error(err));
        };
    }, [client, uuid, onLockReleased]);

    return '';
};

LockManager.propTypes = {
    onLockReleased: PropTypes.func,
    uuid: PropTypes.string.isRequired
};
