import {generateLockEditorId, getLockEditorId} from './LockUtils';
import {useSubscription} from 'react-apollo-hooks';
import {SubscribeToEditorLock} from './LockEditor.gql-subscription';
import * as PropTypes from 'prop-types';

export const useLockEditor = path => {
    // Generate editorId
    generateLockEditorId();

    // Lock and subscribe
    useSubscription(SubscribeToEditorLock, {
        variables: {
            nodePath: path,
            editorID: getLockEditorId()
        },
        shouldResubscribe: true
    });

    return {};
};

useLockEditor.propTypes = {
    path: PropTypes.string.isRequired
};
