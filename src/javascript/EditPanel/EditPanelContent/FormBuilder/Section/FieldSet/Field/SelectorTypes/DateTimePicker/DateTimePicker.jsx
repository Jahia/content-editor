import React from 'react';
import PropTypes from 'prop-types';
import {FastField} from 'formik';

import {DatePickerInput} from '~/DesignSystem/DatePickerInput';
import dayjs from 'dayjs';
import {fillDisabledDaysFromJCRConstraints} from './DateTimePicker.utils';
import {FieldPropTypes} from '~/EditPanel/FormDefinitions/FormData.proptypes';

const variantMapper = {
    DatePicker: 'date',
    DateTimePicker: 'datetime'
};

export const DateTimePicker = ({id, field, editorContext}) => {
    const variant = variantMapper[field.selectorType];
    const isDateTime = variant === 'datetime';
    const disabledDays = fillDisabledDaysFromJCRConstraints(field, isDateTime);

    // Handle the date format, only "en" have a specific format.
    let displayDateFormat = editorContext.uiLang === 'en' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
    displayDateFormat = isDateTime ? (displayDateFormat + ' HH:mm') : displayDateFormat;
    const displayDateMask = isDateTime ? '__/__/____ __:__' : '__/__/____';

    return (
        <FastField
            name={id}
            component={({field: {value, onChange, ...formikField}, form: {setFieldValue, setFieldTouched}}) => {
                // Remove onChange from props pass to the input component as it is set in it.
                return (
                    <DatePickerInput
                        dayPickerProps={{disabledDays}}
                        lang={editorContext.uiLang}
                        initialValue={value ? dayjs(value).toDate() : value}
                        onChange={date => {
                            // Null is received when the date is reset
                            const newDate = date && dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS');
                            setFieldValue(id, newDate, true);
                            setFieldTouched(field.name, field.multiple ? [true] : true);
                        }}
                        {...formikField}
                        displayDateFormat={displayDateFormat}
                        displayDateMask={displayDateMask}
                        readOnly={field.readOnly}
                        variant={variant}
                        id={id}
                        inputProps={{
                            'aria-labelledby': `${field.name}-label`
                        }}
                        onBlur={() => {
                            /* Do Nothing on blur BACKLOG-10095 */
                        }}
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
    field: FieldPropTypes.isRequired
};
