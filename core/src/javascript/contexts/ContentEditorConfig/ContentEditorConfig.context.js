import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorConfigContext = React.createContext({});
export const useContentEditorConfigContext = () => useContext(ContentEditorConfigContext);

export const ContentEditorConfigContextProvider = ({config, children}) => (
    <ContentEditorConfigContext.Provider value={config}>
        {children}
    </ContentEditorConfigContext.Provider>
);

ContentEditorConfigContextProvider.propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};
