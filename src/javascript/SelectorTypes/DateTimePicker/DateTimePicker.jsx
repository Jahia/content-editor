import React from 'react';
import PropTypes from 'prop-types';

import {DatePickerInput} from '~/DesignSystem/DatePickerInput';
import dayjs from 'dayjs';
import {fillDisabledDaysFromJCRConstraints} from './DateTimePicker.utils';
import {FieldPropTypes} from '~/ContentEditor.proptypes';
import {specificDateFormat} from './DateTimePicker.formats';
import {useSelector} from 'react-redux';

const variantMapper = {
    DatePicker: 'date',
    DateTimePicker: 'datetime'
};

export const DateTimePicker = ({id, field, value, editorContext, onChange, onBlur}) => {
    const variant = variantMapper[field.selectorType];
    const isDateTime = variant === 'datetime';
    const disabledDays = fillDisabledDaysFromJCRConstraints(field, isDateTime);
    const uilang = useSelector(state => state.uilang);

    const userNavigatorLocale = editorContext.browserLang;

    let dateFormat = userNavigatorLocale in specificDateFormat ? specificDateFormat[userNavigatorLocale] : 'DD/MM/YYYY';
    let displayDateFormat = isDateTime ? (dateFormat + ' HH:mm') : dateFormat;

    let maskLocale = String(dateFormat).replace(/[^\W]+?/g, '_');

    const displayDateMask = isDateTime ? maskLocale + ' __:__' : maskLocale;

    return (
        <DatePickerInput
            dayPickerProps={{disabledDays}}
            lang={uilang}
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
            onBlur={onBlur}
        />
    );
};

DateTimePicker.defaultProps = {
    value: ''
};

DateTimePicker.propTypes = {
    id: PropTypes.string.isRequired,
    editorContext: PropTypes.shape({
        browserLang: PropTypes.string.isRequired
    }).isRequired,
    field: FieldPropTypes.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired
};
