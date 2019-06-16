import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

import {DatePickerInput} from '../../../../../../DesignSystem/DatePickerInput';
import dayjs from 'dayjs';
import {fillDisabledDaysFromJCRConstraints} from './DateTimePicker.utils';

const variantMapper = {
    DatePicker: 'date',
    DateTimePicker: 'datetime'
};

export const DateTimePicker = ({id, field, editorContext}) => {
    const displayDateFormat = field.formDefinition.selectorOptions.find(option => option.name === 'format');
    const variant = variantMapper[field.formDefinition.selectorType];
    const disabledDays = fillDisabledDaysFromJCRConstraints(field, variant === 'datetime');
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                // Remove onChange from props pass to the input component as it is set in it.
                const {value, onChange, ...formikField} = props.field;
                  return (
                      <DatePickerInput
                          dayPickerProps={{disabledDays}}
                          lang={editorContext.lang}
                          initialValue={value ? dayjs(value).toDate() : value}
                          onChange={
                            date => {
                                // TODO: QA-11925 - save date in ISO format without timezone
                                // eslint-disable-next-line
                                props.form.setFieldValue(field.formDefinition.name, date, true);
                            }
                        }
                          {...formikField}
                          displayDateFormat={displayDateFormat && displayDateFormat.value}
                          readOnly={field.formDefinition.readOnly}
                          variant={variant}
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
