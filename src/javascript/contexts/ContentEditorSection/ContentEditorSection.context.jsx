import React, {useContext, useRef, useState} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);

export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    const previousValue = useRef();
    const [sections, setSectionsState] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [, setChangeCount] = useState(0);

    const stringifiedSections = formSections && JSON.stringify(formSections);
    if (stringifiedSections && previousValue.current !== stringifiedSections) {
        previousValue.current = stringifiedSections;
        const sectionsCopy = JSON.parse(stringifiedSections);
        setSectionsState(sectionsCopy);
        if (Object.keys(expanded).length === 0) {
            setExpanded(sectionsCopy.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded
            }), {}));
        }
    }

    const onSectionsUpdate = () => {
        setChangeCount(i => i + 1);
    };

    const getSections = () => {
        return sections;
    };

    const setSections = () => {
        console.warn('Sections update is deprecated');
        onSectionsUpdate();
    };

    return (
        <ContentEditorSectionContext.Provider value={{sections, getSections, onSectionsUpdate, setSections, expanded, setExpanded}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
