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
    const variant = variantMapper[field.formDefinition.selectorType];
    const isDateTime = variant === 'datetime';
    const disabledDays = fillDisabledDaysFromJCRConstraints(field, isDateTime);

    // Handle the date format, only "en" have a specific format.
    let displayDateFormat = editorContext.uiLang === 'en' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
    displayDateFormat = isDateTime ? (displayDateFormat + ' HH:mm') : displayDateFormat;
    const displayDateMask = isDateTime ? '__/__/____ __:__' : '__/__/____';

    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                // Remove onChange from props pass to the input component as it is set in it.
                // eslint-disable-next-line react/prop-types
                const {value, onChange, ...formikField} = props.field;
                  return (
                      <DatePickerInput
                          dayPickerProps={{disabledDays}}
                          lang={editorContext.uiLang}
                          initialValue={value ? dayjs(value).toDate() : value}
                          onChange={
                            date => {
                                // TODO: QA-11925 - save date in ISO format without timezone
                                // eslint-disable-next-line
                                props.form.setFieldValue(field.formDefinition.name, date, true);
                            }
                        }
                          {...formikField}
                          displayDateFormat={displayDateFormat}
                          displayDateMask={displayDateMask}
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
        lng: PropTypes.string,
        uiLang: PropTypes.string.isRequired
    }).isRequired,
    field: PropTypes.shape({
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired,
            selectorOptions: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string
            })).isRequired,
            selectorType: PropTypes.string,
            readOnly: PropTypes.bool
        }).isRequired
    }).isRequired
};
