import {MultipleInput} from '../../../../../../../DesignSystem/MultipleInput';
import {Field} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../../../../../FormDefinitions/FromData.proptypes';

const MultipleSelect = ({field, id}) => {
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                const formikField = props.field;

                const options = field.formDefinition.valueConstraints
                    .map(constraint => ({
                        label: constraint.displayValue,
                        value: constraint.value.string
                    }));

                return (
                    <MultipleInput
                        {...formikField}
                        id={id}
                        options={options}
                        value={
                            formikField.value &&
                            options.filter(data => formikField.value.includes(data.value))
                        }
                        readOnly={field.formDefinition.readOnly}
                        onBlur={() => {/* Do Nothing on blur BACKLOG-10095 */}}
                        onChange={selection => {
                            const newSelection = selection && selection.map(data => data.value);
                            // eslint-disable-next-line react/prop-types
                            props.form.setFieldValue(field.formDefinition.name, newSelection, false);
                        }}
                    />
                );
            }}
        />
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired
};

export default MultipleSelect;
