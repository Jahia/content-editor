import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);
export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    // We use a reference to be able to read the sections from the closures calls like init / unMount of onChange
    const [sections, setSections] = useState(formSections);
    const getSections = () => sections;

    return (
        <ContentEditorSectionContext.Provider value={{sections, setSections, getSections}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
