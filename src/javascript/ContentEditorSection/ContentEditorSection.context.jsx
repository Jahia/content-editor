import React, {useContext, useState, useEffect} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);
export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (!sections || sections.length === 0) {
            setSections(formSections);
        }
    }, [formSections]);

    return (
        <ContentEditorSectionContext.Provider value={{sections, setSections}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
