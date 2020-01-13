import {useSubscription} from 'react-apollo-hooks';
import * as PropTypes from 'prop-types';
import React from 'react';
import {generateLockEditorId, getLockEditorId} from './LockUtils';
import {SubscribeToEditorLock} from './SubscribeToLock.gql-subscription';

const LockEditor = ({nodePath}) => {
    generateLockEditorId();

    useSubscription(SubscribeToEditorLock, {
        variables: {
            nodePath: nodePath,
            editorID: getLockEditorId()
        },
        shouldResubscribe: true
    });
    return <></>;
};

LockEditor.propTypes = {
    nodePath: PropTypes.string.isRequired
};

LockEditor.displayName = 'LockEditor';
export default LockEditor;
