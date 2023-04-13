import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import {DatePicker} from '../DatePicker';
import {Input} from '@jahia/design-system-kit';

import dayjs from '../../date.config';

import {Popover} from '@material-ui/core';
import NumberFormat from 'react-number-format';
import {Button, Calendar} from '@jahia/moonstone';

const datetimeFormat = {
    date: 'L',
    datetime: 'L HH:mm'
};

const formatDateTime = (datetime, lang, variant, displayDateFormat) => {
    if (!datetime) {
        return '';
    }

    return dayjs(datetime)
        .locale(lang)
        .format(displayDateFormat || datetimeFormat[variant]);
};

export const getMaskOptions = (displayDateMask, isDateTime) => {
    const mask = displayDateMask ? displayDateMask : (isDateTime ? '__/__/____ __:__' : '__/__/____');
    return {
        mask: mask.replace(/_/g, '#'),
        empty: mask
    };
};

const CustomInput = ({value, ...others}) => {
    return (
        <Input
            value={value}
            {...others}
        />
    );
};

export const DatePickerInput = ({
    variant,
    lang,
    dayPickerProps,
    onChange,
    onBlur,
    initialValue,
    readOnly,
    displayDateFormat,
    displayDateMask,
    ...props
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [datetime, setDatetime] = useState(initialValue);
    const [datetimeString, setDatetimeString] = useState(
        formatDateTime(initialValue, lang, variant, displayDateFormat)
    );

    useEffect(() => {
        setDatetime(initialValue);
        setDatetimeString(formatDateTime(initialValue, lang, variant, displayDateFormat));
    }, [setDatetime, setDatetimeString, initialValue, lang, variant, displayDateFormat]);

    const isDateTime = variant === 'datetime';
    const htmlInput = useRef();
    const maskOptions = getMaskOptions(displayDateMask, isDateTime);

    const handleOpenPicker = () => {
        if (!readOnly) {
            setAnchorEl(htmlInput.current.parentElement);
        }
    };

    const handleInputChange = e => {
        if (e && e.target) {
            setDatetimeString(e.target.value);

            if (maskOptions.empty === e.target.value) {
                setDatetime(null);
                onChange(null);
            } else if (!e.target.value.includes('_')) {
                const newDate = dayjs(e.target.value, displayDateFormat || datetimeFormat[variant], lang);
                if (newDate.isValid()) {
                    setDatetimeString(newDate.locale(lang).format(displayDateFormat || datetimeFormat[variant]));
                    setDatetime(newDate.toDate());
                    onChange(newDate.toDate());
                } else {
                    onChange(e.target.value);
                }
            }
        }
    };

    const InteractiveVariant = (
        <Button aria-label="Open date picker"
                variant="ghost"
                icon={<Calendar/>}
                onClick={handleOpenPicker}
        />
    );

    return (
        <div>
            <NumberFormat
                inputRef={htmlInput}
                customInput={CustomInput}
                format={maskOptions.mask}
                placeholder={maskOptions.empty}
                mask="_"
                data-sel-readonly={readOnly}
                variant={{
                    interactive: InteractiveVariant
                }}
                readOnly={readOnly}
                value={datetimeString}
                onChange={handleInputChange}
                onBlur={onBlur}
                {...props}
            />
            <Popover open={Boolean(anchorEl)}
                     anchorEl={anchorEl}
                     anchorOrigin={{
                         vertical: 'bottom',
                         horizontal: 'left'
                     }}
                     transformOrigin={{
                         vertical: 'top',
                         horizontal: 'left'
                     }}
                     onClose={() => {
                         onChange(datetime);
                         onBlur();
                         setAnchorEl(null);
                    }}
            >
                <DatePicker
                    variant={variant}
                    lang={lang}
                    selectedDateTime={datetime}
                    onSelectDateTime={datetime => {
                        setDatetime(datetime);
                        setDatetimeString(
                            formatDateTime(datetime, lang, variant, displayDateFormat)
                        );
                    }}
                    {...dayPickerProps}
                />
            </Popover>
        </div>
    );
};

CustomInput.propTypes = {
    value: PropTypes.string
};

CustomInput.defaultProps = {
    value: ''
};

DatePickerInput.defaultProps = {
    dayPickerProps: {},
    variant: 'date',
    onChange: () => {},
    onBlur: () => {},
    initialValue: null,
    readOnly: false,
    displayDateFormat: null,
    displayDateMask: null
};

DatePickerInput.propTypes = {
    dayPickerProps: PropTypes.object,
    lang: PropTypes.oneOf(['fr', 'en', 'de']).isRequired,
    variant: PropTypes.oneOf(['date', 'datetime']),
    initialValue: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    readOnly: PropTypes.bool,
    displayDateFormat: PropTypes.string,
    displayDateMask: PropTypes.string
};

DatePickerInput.displayName = 'DatePickerInput';
