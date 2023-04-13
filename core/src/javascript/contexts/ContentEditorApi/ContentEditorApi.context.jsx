import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorApiContext = React.createContext({});

export const useContentEditorApiContext = () => useContext(ContentEditorApiContext);

export const ContentEditorApiContextProvider = ({children}) => {
    return (
        <ContentEditorApiContext.Provider value={{}}>
            {children}
        </ContentEditorApiContext.Provider>
    );
};

ContentEditorApiContextProvider.propTypes = {
    children: PropTypes.node.isRequired
};
