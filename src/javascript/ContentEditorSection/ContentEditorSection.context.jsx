import React, {useContext, useState, useEffect, useRef} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);
export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    // We use a reference to be able to read the sections from the closures calls like init / unMount of onChange
    const localSections = useRef([]);
    const [sections, setSections] = useState(localSections.current);

    useEffect(() => {
        if (!sections || sections.length === 0) {
            globalSetSection(formSections);
        }
    }, [sections, setSections, formSections]);

    const globalSetSection = sections => {
        setSections(sections);
        localSections.current = sections;
    };

    const getSections = () => localSections.current;

    return (
        <ContentEditorSectionContext.Provider value={{sections, setSections: globalSetSection, getSections}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
