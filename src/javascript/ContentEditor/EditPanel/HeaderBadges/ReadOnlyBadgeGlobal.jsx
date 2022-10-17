import React from 'react';
import {useContentEditorContext, useContentEditorSectionContext} from '~/contexts';
import {useSelector} from 'react-redux';
import {ReadOnlyBadge} from './ReadOnlyBadge';

export const ReadOnlyBadgeGlobal = () => {
    const {nodeData} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const sectionToggleStates = useSelector(state => state.contenteditor.ceToggleSections);

    const sectionsWithReadOnlyFields = sections.reduce((acc, s) => {
        if (s.fieldSets.find(fs => fs.fields.find(f => f.readOnly))) {
            acc.push(s.name);
        }

        return acc;
    }, []);

    if ((sectionsWithReadOnlyFields.length > 0 && !sectionsWithReadOnlyFields.find(s => sectionToggleStates[s])) || nodeData.lockedAndCannotBeEdited) {
        return <ReadOnlyBadge/>;
    }

    return null;
};
