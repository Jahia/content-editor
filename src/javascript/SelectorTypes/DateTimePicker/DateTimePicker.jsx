import React from 'react';
import PropTypes from 'prop-types';

import {DatePickerInput} from '~/DesignSystem/DatePickerInput';
import dayjs from 'dayjs';
import {fillDisabledDaysFromJCRConstraints} from './DateTimePicker.utils';
import {FieldPropTypes} from '~/FormDefinitions/FormData.proptypes';

const variantMapper = {
    DatePicker: 'date',
    DateTimePicker: 'datetime'
};

export const DateTimePicker = ({id, field, value, editorContext, onChange}) => {
    const variant = variantMapper[field.selectorType];
    const isDateTime = variant === 'datetime';
    const disabledDays = fillDisabledDaysFromJCRConstraints(field, isDateTime);

    // Handle the date format, only "en" have a specific format.
    let displayDateFormat = editorContext.uilang === 'en' ? 'MM/DD/YYYY' : 'DD/MM/YYYY';
    displayDateFormat = isDateTime ? (displayDateFormat + ' HH:mm') : displayDateFormat;
    const displayDateMask = isDateTime ? '__/__/____ __:__' : '__/__/____';

    return (
        <DatePickerInput
            dayPickerProps={{disabledDays}}
            lang={editorContext.uilang}
            initialValue={value ? dayjs(value).toDate() : value}
            displayDateFormat={displayDateFormat}
            displayDateMask={displayDateMask}
            readOnly={field.readOnly}
            variant={variant}
            id={id}
            inputProps={{
                'aria-labelledby': `${field.name}-label`
            }}
            onChange={date => {
                onChange(date && dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS'));
            }}
        />
    );
};

DateTimePicker.defaultProps = {
    value: ''
};

DateTimePicker.propTypes = {
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.shape({
        lng: PropTypes.string,
        uilang: PropTypes.string.isRequired
    }).isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};
