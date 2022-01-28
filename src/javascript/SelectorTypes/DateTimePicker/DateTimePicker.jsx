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

    const userNavigatorLocale = editorContext.navigatorLocale;

    // Handle the date format, some languages have a specific format that we can manage here.
    // Please note that a single digit format is not supported by our DatePicker, e.g. 'D/M/YYYY' or 'D.M.YYYY'.
    const specificDateFormat = {
        'de-AT': 'DD.MM.YYYY',
        'de-CH': 'DD.MM.YYYY',
        'de-DE': 'DD.MM.YYYY',
        'de-LI': 'DD.MM.YYYY',
        'de-LU': 'DD.MM.YYYY',
        'en-PH': 'MM/DD/YYYY',
        'en-US': 'MM/DD/YYYY',
        'en-ZW': 'MM/DD/YYYY',
        'es-PA': 'MM/DD/YYYY',
        'es-US': 'MM/DD/YYYY',
        'zh-CN': 'YYYY/MM/DD'
    };

    let dateFormat = userNavigatorLocale in specificDateFormat ? specificDateFormat[userNavigatorLocale] : 'DD/MM/YYYY';
    let displayDateFormat = isDateTime ? (dateFormat + ' HH:mm') : dateFormat;

    // Handle most commonly used date format separators, required to generate the input date mask.
    let separator = '';
    switch (true) {
        case (dateFormat.indexOf('.') > -1):
            separator = '.';
            break;
        case (dateFormat.indexOf('-') > -1):
            separator = '-';
            break;
        default:
            separator = '/';
            break;
    }

    let regex = new RegExp('[^' + separator + ']+?', 'g');
    let maskLocale = String(dateFormat).replace(regex, '_');

    const displayDateMask = isDateTime ? maskLocale + ' __:__' : maskLocale;

    return (
        <DatePickerInput
            navigatorLocale={editorContext.navigatorLocale}
            dayPickerProps={{disabledDays}}
            lang={editorContext.uilang}
            initialValue={value ? dayjs(value).toDate() : null}
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
        uilang: PropTypes.string.isRequired,
        navigatorLocale: PropTypes.string.isRequired
    }).isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};
