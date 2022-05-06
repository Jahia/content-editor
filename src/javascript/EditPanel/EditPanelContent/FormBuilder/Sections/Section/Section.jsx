import {Collapsible} from '@jahia/moonstone';
import FieldSetsDisplay from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetsDisplay';
import {filterRegularFieldSets} from '~/EditPanel/EditPanelContent/FormBuilder/FormBuilder.fieldSetHelp';
import React from 'react';
import PropTypes from 'prop-types';
import {SectionPropTypes} from '~/FormDefinitions';

export const Section = ({section, isExpanded, onClick}) => {
    const fieldSets = filterRegularFieldSets(section.fieldSets);

    if (fieldSets.length === 0) {
        return null;
    }

    return (
        <Collapsible data-sel-content-editor-fields-group={section.displayName}
                     label={section.displayName}
                     isExpanded={isExpanded}
                     onClick={onClick}
        >
            <FieldSetsDisplay fieldSets={filterRegularFieldSets(section.fieldSets)}/>
        </Collapsible>
    );
};

Section.propTypes = {
    section: SectionPropTypes.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

Section.displayName = 'Section';
