import * as PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useUnlockEditor} from './UnlockEditor';
import {useLockEditor} from './LockEditor';
import {compose, withApollo} from 'react-apollo';

export const LockedEditorContext = React.createContext({});

export const useLockedEditorContext = () => useContext(LockedEditorContext);

const LockedEditorContextProviderCmp = ({path, children, client}) => {
    useLockEditor(path);
    const {unlockEditor} = useUnlockEditor(client);

    const lockedEditorContext = {unlockEditor};

    return (
        <LockedEditorContext.Provider value={lockedEditorContext}>
            {children}
        </LockedEditorContext.Provider>
    );
};

LockedEditorContextProviderCmp.propTypes = {
    children: PropTypes.node.isRequired,
    client: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired
};

export const LockedEditorContextProvider = compose(
    withApollo
)(LockedEditorContextProviderCmp);
