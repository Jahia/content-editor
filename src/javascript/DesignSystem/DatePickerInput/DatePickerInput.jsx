import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {DatePicker} from '../DatePicker';
import {withStyles} from '@material-ui/core/styles';
import {Input} from '../Input';
import {javaDateFormatToJSDF} from './date.util';

import dayjs from 'dayjs';
import {IconButton} from '@material-ui/core';
import {DateRange} from '@material-ui/icons';
import Popover from '@material-ui/core/Popover/Popover';

const style = {
    overlay: {
        position: 'absolute',
        zIndex: 1
    }
};

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
        .format(javaDateFormatToJSDF(displayDateFormat) || datetimeFormat[variant]);
};

const DatePickerInputCmp = ({
    variant,
    lang,
    classes,
    onBlur,
    onChange,
    initialValue,
    readOnly,
    displayDateFormat,
    ...props
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [datetime, setDatetime] = useState(initialValue);
    const [datetimeString, setDatetimeString] = useState(
        formatDateTime(datetime, lang, variant, displayDateFormat)
    );

    const htmlInput = useRef();

    const handleOpenPicker = () => {
        setAnchorEl(htmlInput.current.parentElement);
    };

    useEffect(() => {
        setDatetimeString(formatDateTime(datetime, lang, variant, displayDateFormat));
    }, [lang, variant, displayDateFormat]); // eslint-disable-line react-hooks/exhaustive-deps

    const InteractiveVariant = (
        <IconButton disableRipple
                    aria-label="Open date picker"
                    onClick={handleOpenPicker}
        >
            <DateRange/>
        </IconButton>
    );

    return (
        <div>
            <Input
                inputRef={htmlInput}
                readOnly={readOnly}
                value={datetimeString}
                variant={{
                    interactive: InteractiveVariant
                }}
                onChange={e => {
                    setDatetimeString(e.target.value);
                    const newDate = dayjs(
                        e.target.value,
                        datetimeFormat[variant]
                    );
                    if (newDate.isValid()) {
                        setDatetime(newDate.toDate());
                        onChange(newDate.toDate().toISOString());
                    }
                }}
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
                        setAnchorEl(null);
                    }}
            >
                <DatePicker
                    variant={variant}
                    lang={lang}
                    selectedDateTime={datetime}
                    onSelectDateTime={datetime => {
                        onChange(datetime.toISOString());
                        setDatetime(datetime);
                        setDatetimeString(
                            formatDateTime(datetime, lang, variant, displayDateFormat)
                        );
                    }}
                />
            </Popover>
        </div>
    );
};

DatePickerInputCmp.defaultProps = {
    variant: 'date',
    onBlur: () => {},
    onChange: () => {},
    initialValue: null,
    readOnly: false,
    displayDateFormat: null
};

DatePickerInputCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    lang: PropTypes.oneOf(['fr', 'en', 'de']).isRequired,
    variant: PropTypes.oneOf(['date', 'datetime']),
    initialValue: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    displayDateFormat: PropTypes.string
};

export const DatePickerInput = withStyles(style)(DatePickerInputCmp);

DatePickerInput.displayName = 'DatePickerInput';
