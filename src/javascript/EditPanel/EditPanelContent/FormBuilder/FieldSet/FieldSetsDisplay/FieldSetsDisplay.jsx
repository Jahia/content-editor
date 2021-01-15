import React from 'react';
import PropTypes from 'prop-types';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldSet} from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet';
import FieldSetWithNodeChecks
    from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetWithNodeChecks/FieldSetWithNodeChecks';

const FieldSetsDisplay = ({fieldSets, fieldSetMapFcn = x => x}) => {
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

export default FieldSetsDisplay;
