import React, {useContext} from 'react';
import * as PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

export const ContentEditorConfigContext = React.createContext({});
export const useContentEditorConfigContext = () => useContext(ContentEditorConfigContext);

export const ContentEditorConfigContextProvider = ({config, children}) => {
    // Read expanded sections only once
    const expandedSections = useSelector(state => state.contenteditor.ceToggleSections[config?.mode + '_' + config?.uuid], () => true);

    return (
        <ContentEditorConfigContext.Provider value={{expandedSections, ...config}}>
            {children}
        </ContentEditorConfigContext.Provider>
    );
};

ContentEditorConfigContextProvider.propTypes = {
    config: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
};
