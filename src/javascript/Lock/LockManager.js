import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useSubscription, useApolloClient} from '@apollo/react-hooks';
import {useEditorIdContext} from '../ContentEditorId.context';
import {SubscribeToEditorLock} from './lock.gql-subscription';
import {UnlockEditorMutation} from './lock.gql-mutation';

export const LockManager = ({path}) => {
    const {editorId} = useEditorIdContext();
    const client = useApolloClient();

    // Lock and subscribe to ping the server we are editing
    useSubscription(SubscribeToEditorLock, {
        variables: {
            nodePath: path,
            editorID: editorId
        },
        shouldResubscribe: true
    });

    useEffect(() => {
        const unlock = () => {
            client
                .mutate({
                    mutation: UnlockEditorMutation,
                    variables: {
                        editorID: editorId
                    }
                })
                .catch(err => console.error(err));
        };

        return () => {
            unlock();
        };
    }, [client, editorId]);

    return '';
};

LockManager.propTypes = {
    path: PropTypes.string.isRequired
};
