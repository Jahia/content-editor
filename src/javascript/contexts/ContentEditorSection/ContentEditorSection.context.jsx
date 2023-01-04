import React, {useContext, useEffect, useState} from 'react';
import * as PropTypes from 'prop-types';
import {contentEditorHelper} from '~/editorTabs/EditPanelContent/FormBuilder/Field/contentEditorHelper';
import {getFields} from '~/utils';

function arrayEquals(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

export const ContentEditorSectionContext = React.createContext({});

export const useContentEditorSectionContext = () => useContext(ContentEditorSectionContext);

export const ContentEditorSectionContextProvider = ({formSections, children}) => {
    const sections = formSections && JSON.parse(JSON.stringify(formSections));
    const [expanded, setExpanded] = useState({});
    const [addedMixins, setAddedMixins] = useState({});
    const [addedConstraints, setAddedConstraints] = useState({});

    useEffect(() => {
        // Only expand section on initial setup, when expanded is still empty
        if (Object.keys(expanded).length === 0 && sections) {
            setExpanded(sections.reduce((acc, curr) => ({
                ...acc,
                [curr.name]: acc[curr.name] ? acc[curr.name] : curr.expanded
            }), {}));
        }
    }, [sections, expanded]);

    const onSectionsUpdate = () => {
        console.warn('Sections update is deprecated');
    };

    const getSections = () => {
        return sections;
    };

    const setSections = onSectionsUpdate;

    if (sections) {
        // Apply mixins and constraints
        Object.keys(addedMixins).forEach(mixin => {
            contentEditorHelper.moveFieldsToAnotherFieldset(mixin, addedMixins[mixin].targetFieldSet, sections, addedMixins[mixin].field);
        });

        Object.keys(addedConstraints).forEach(fieldName => {
            const fieldToUpdate = getFields(sections).find(f => f.name === fieldName);
            const valueConstraints = addedConstraints[fieldName].constraints;
            if (fieldToUpdate && !arrayEquals(fieldToUpdate.valueConstraints, valueConstraints)) {
                fieldToUpdate.valueConstraints = valueConstraints;
            }
        });
    }

    return (
        <ContentEditorSectionContext.Provider value={{sections, getSections, onSectionsUpdate, setSections, expanded, setExpanded, addedMixins, setAddedMixins, addedConstraints, setAddedConstraints}}>
            {children}
        </ContentEditorSectionContext.Provider>
    );
};

ContentEditorSectionContextProvider.propTypes = {
    formSections: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired
};
