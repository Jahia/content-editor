import React from 'react';
import PropTypes from 'prop-types';
import {FieldSetPropTypes} from '../../../../ContentEditor.proptypes';
import {FieldSet} from './FieldSet';
import {FieldSetWithNodeChecks} from './FieldSetWithNodeChecks';

export const FieldSetsDisplay = ({fieldSets}) => {
    if (!fieldSets || fieldSets.length === 0) {
        return null;
    }

    return (
        fieldSets.map(fs => {
            if (fs.nodeCheck) {
                return <FieldSetWithNodeChecks key={fs.name} fieldset={fs}/>;
            }

            return <FieldSet key={fs.name} fieldset={fs}/>;
        })
    );
};

FieldSetsDisplay.propTypes = {
    fieldSets: PropTypes.arrayOf(FieldSetPropTypes)
};
