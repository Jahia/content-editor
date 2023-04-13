import React from 'react';
import * as PropTypes from 'prop-types';
import {Checkbox} from '@jahia/moonstone';
import {FieldPropTypes} from '~/ContentEditor.proptypes';

export const Boolean = ({field, value, id, onChange, onBlur}) => {
    return (
        <Checkbox
            id={id}
            checked={value === true}
            isReadOnly={field.readOnly}
            isDisabled={field.readOnly}
            onChange={() => onChange(!value)}
            onBlur={onBlur}
        />
    );
};

Boolean.propTypes = {
    field: FieldPropTypes.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
