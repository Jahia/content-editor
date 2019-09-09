import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

import {FieldPropTypes} from '../../../../../../../../FormDefinitions/FormData.proptypes';
import {TextArea} from '~DesignSystem/TextArea';

export const TextAreaField = ({id, field}) => {
    return (
        <Field
            name={id}
            render={props => {
                const {name, value, onChange} = props.field;

                return (
                    <TextArea id={id}
                              name={name}
                              value={value || ''}
                              disabled={field.readOnly}
                              onChange={onChange}
                    />
                );
            }}
        />

    );
};

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired
};
