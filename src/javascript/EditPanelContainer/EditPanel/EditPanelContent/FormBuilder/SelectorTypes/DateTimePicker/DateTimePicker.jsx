import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

import {DatePickerInput} from '../../../../../../DesignSystem/DatePickerInput';
import dayjs from 'dayjs';

export const DateTimePicker = ({id, field, editorContext}) => {
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                const {value, onChange, ...formikField} = props.field;
                const displayDateFormat = field.formDefinition.selectorOptions.find(option => option.name === 'format');

                return (
                    <DatePickerInput
                        lang={editorContext.lang}
                        initialValue={value ? dayjs(value).toDate() : value}
                        onChange={
                            date => {
                                // eslint-disable-next-line
                                props.form.setFieldValue(field.formDefinition.name, date, true);
                            }
                        }
                        {...formikField}
                        displayDateFormat={displayDateFormat && displayDateFormat.value}
                        readOnly={field.formDefinition.readOnly}
                        variant="datetime"
                        id={id}
                    />
                );
            }}
        />
    );
};

DateTimePicker.propTypes = {
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.shape({
        lng: PropTypes.string
    }).isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired,
            selectorOptions: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string
            })).isRequired
        }).isRequired
    }).isRequired
};
