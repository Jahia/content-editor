import React, {useContext, useState} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorHistoryContext = React.createContext({});

export const useContentEditorHistoryContext = () => useContext(ContentEditorHistoryContext);

export const ContentEditorHistoryContextProvider = ({children}) => {
    const [storedLocation, setStoredLocation] = useState(undefined);
    return (
        <ContentEditorHistoryContext.Provider value={{storedLocation, setStoredLocation}}>
            {children}
        </ContentEditorHistoryContext.Provider>
    );
};

ContentEditorHistoryContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
