import React from 'react';
import PropTypes from 'prop-types';
import {FieldSetPropTypes} from '~/ContentEditor.proptypes';
import {FieldSet} from './FieldSet';
import {FieldSetWithNodeChecks} from './FieldSetWithNodeChecks';

export const FieldSetsDisplay = ({fieldSets, fieldSetMapFcn = x => x}) => {
    if (!fieldSets || fieldSets.length === 0) {
        return null;
    }

    return (
        fieldSets.map(f => {
            const fs = fieldSetMapFcn(f);

            if (fs.nodeCheck) {
                return <FieldSetWithNodeChecks fieldset={fs}/>;
            }

            return <FieldSet key={fs.name} fieldset={fs}/>;
        })
    );
};

FieldSetsDisplay.propTypes = {
    fieldSets: PropTypes.arrayOf(FieldSetPropTypes),
    fieldSetMapFcn: PropTypes.func
};
