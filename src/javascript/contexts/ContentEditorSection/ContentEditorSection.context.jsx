import React, {useContext, useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);

export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    const [sections, setSectionsState] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [, setChangeCount] = useState(0);

    useEffect(() => {
        if (formSections) {
            setSectionsState(JSON.parse(JSON.stringify(formSections)));
        }
    }, [formSections]);

    useEffect(() => {
        // Only expand section on initial setup, when expanded is still empty
        if (Object.keys(expanded).length === 0 && formSections) {
            setExpanded(formSections.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded
            }), {}));
        }
    }, [formSections, expanded]);

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
