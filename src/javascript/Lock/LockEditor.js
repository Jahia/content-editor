import {useSubscription} from 'react-apollo-hooks';
import {SubscribeToEditorLock} from './LockEditor.gql-subscription';
import * as PropTypes from 'prop-types';
import {useEditorIdContext} from '../ContentEditorId.context';

export const useLockEditor = path => {
    const {editorId} = useEditorIdContext();

    // Lock and subscribe
    useSubscription(SubscribeToEditorLock, {
        variables: {
            nodePath: path,
            editorID: editorId
        },
        shouldResubscribe: true
    });

    return {};
};

useLockEditor.propTypes = {
    path: PropTypes.string.isRequired
};
