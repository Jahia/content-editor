import React from 'react';
import {FieldPropTypes} from '~/ContentEditor.proptypes';

import {SingleSelect} from './SingleSelect/SingleSelect';
import {MultipleSelect} from './MultipleSelect/MultipleSelect';

export const ChoiceList = ({field, ...props}) => {
    if (field.multiple) {
        return <MultipleSelect field={field} {...props}/>;
    }

    return <SingleSelect field={field} {...props}/>;
};

ChoiceList.propTypes = {
    field: FieldPropTypes.isRequired
};

