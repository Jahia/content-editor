import React, {useContext, useRef, useState} from 'react';
import * as PropTypes from 'prop-types';
import {useContentEditorConfigContext} from '~/contexts';

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);
export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    const sections = useRef();
    const {expanded, setExpanded} = useContentEditorConfigContext();

    if (!sections.current) {
        sections.current = formSections;
        if (Object.keys(expanded).length === 0) {
            setExpanded(formSections.reduce((acc, curr) => ({...acc, [curr.name]: curr.expanded}), {}));
        }
    }

    const [, setChangeCount] = useState(0);

    const onSectionsUpdate = () => {
        setChangeCount(i => i + 1);
    };

    const getSections = () => {
        return sections.current;
    };

    const setSections = () => {
        console.warn('Sections update is deprecated');
        onSectionsUpdate();
    };

    return (
        <ContentEditorSectionContext.Provider value={{sections: sections.current, getSections, onSectionsUpdate, setSections}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
