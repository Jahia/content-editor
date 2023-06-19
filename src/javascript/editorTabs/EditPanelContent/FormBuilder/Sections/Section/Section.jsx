import {Collapsible} from '@jahia/moonstone';
import {FieldSetsDisplay} from '../../FieldSet';
import React from 'react';
import PropTypes from 'prop-types';
import {SectionPropTypes} from '~/ContentEditor.proptypes';

const filterRegularFieldSets = fieldSets => {
    const showFieldSet = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        if (fieldSet.dynamic && !fieldSet.hasEnableSwitch && !fieldSet.activated) {
            return false;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and
        // the fieldSet doesn't contain any fields (empty).
        return fieldSet.dynamic || fieldSet.fields.length > 0;
    };

    return fieldSets.filter(fs => showFieldSet(fs));
};

export const Section = ({section, isExpanded, onClick}) => {
    const fieldSets = filterRegularFieldSets(section.fieldSets);

    if (fieldSets.length === 0) {
        return null;
    }

    const sectionName = section.displayName !== '' ? section.displayName : section.name;

    if (section.hideHeader) {
        return (
            <FieldSetsDisplay fieldSets={fieldSets}/>
        );
    }

    return (
        <Collapsible data-sel-content-editor-fields-group={sectionName}
                     label={sectionName}
                     isExpanded={isExpanded}
                     onClick={onClick}
        >
            <FieldSetsDisplay fieldSets={fieldSets}/>
        </Collapsible>
    );
};

Section.propTypes = {
    section: SectionPropTypes.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

