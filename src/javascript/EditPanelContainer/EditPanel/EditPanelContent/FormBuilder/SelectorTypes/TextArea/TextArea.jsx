import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

import {TextArea} from '../../../../../../DesignSystem/TextArea';

export const TextAreaField = ({id, field}) => {
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                return <TextArea id={id} disabled={field.formDefinition.readOnly} {...props.field}/>;
            }}
        />

    );
};

TextAreaField.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired
};
