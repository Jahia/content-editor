import {MultipleInput} from '~DesignSystem/MultipleInput';
import {Field} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';
import {FieldPropTypes} from '../../../../../../../../../FormDefinitions/FormData.proptypes';

const MultipleSelect = ({field, id, setActionContext}) => {
    return (
        <Field
            name={field.name}
            render={props => {
                const formikField = props.field;

                const options = field.valueConstraints
                    .map(constraint => ({
                        label: constraint.displayValue,
                        value: constraint.value.string
                    }));

                    setActionContext(prevActionContext => ({
                        initialized: true,
                        menuDisplayDisabled: true,
                        contextHasChange: !prevActionContext.initialized ||
                            // As action system make deep copy of formik each time value change we must update the context !
                            prevActionContext.formik.values[field.name] !== formikField.value
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
                        readOnly={field.readOnly}
                        onBlur={() => {/* Do Nothing on blur BACKLOG-10095 */}}
                        onChange={selection => {
                            const newSelection = selection && selection.map(data => data.value);
                            // eslint-disable-next-line react/prop-types
                            props.form.setFieldValue(field.name, newSelection, false);
                        }}
                    />
                );
            }}
        />
    );
};

MultipleSelect.propTypes = {
    id: PropTypes.string.isRequired,
    field: FieldPropTypes.isRequired,
    setActionContext: PropTypes.func.isRequired
};

export default MultipleSelect;
