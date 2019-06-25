import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';

import {DatePicker} from '../DatePicker';
import {withStyles} from '@material-ui/core/styles';
import {Input} from '../Input';
import InputMask from 'react-input-mask';

import dayjs from '../../date.config';

import {IconButton} from '@material-ui/core';
import {DateRange} from '@material-ui/icons';
import Popover from '@material-ui/core/Popover/Popover';

const styles = theme => ({
    overlay: {
        position: 'absolute',
        zIndex: 1
    },
    datePickerIcon: {
        color: theme.palette.font.gamma + ' !important'
    }
});

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
        mask: mask.replace(/_/g, '9'),
        empty: mask
    };
};

const DatePickerInputCmp = ({
    variant,
    lang,
    classes,
    dayPickerProps,
    onBlur,
    onChange,
    initialValue,
    readOnly,
    displayDateFormat,
    displayDateMask,
    ...props
}) => {
    // Config dayJS
    dayjs.locale(lang);

    const [anchorEl, setAnchorEl] = useState(null);
    const [datetime, setDatetime] = useState(initialValue);
    const [datetimeString, setDatetimeString] = useState(
        formatDateTime(datetime, lang, variant, displayDateFormat)
    );

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
            }

            const newDate = dayjs(e.target.value, displayDateFormat || datetimeFormat[variant], lang);
            if (newDate.isValid()) {
                setDatetime(newDate.toDate());
                onChange(newDate.toDate());
            }
        }
    };

    const InteractiveVariant = (
        <IconButton aria-label="Open date picker"
                    classes={{
                        root: classes.datePickerIcon
                    }}
                    onClick={handleOpenPicker}
        >
            <DateRange/>
        </IconButton>
    );

    return (
        <div>
            <InputMask mask={maskOptions.mask}
                       value={datetimeString}
                       readOnly={readOnly}
                       onChange={handleInputChange}
            >
                {inputProps => (
                    <Input
                        inputRef={htmlInput}
                        variant={{
                            interactive: InteractiveVariant
                        }}
                        data-sel-readonly={readOnly}
                        {...inputProps}
                        {...props}
                    />
                )}
            </InputMask>
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
                        onChange(datetime);
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

DatePickerInputCmp.defaultProps = {
    dayPickerProps: {},
    variant: 'date',
    onBlur: () => {},
    onChange: () => {},
    initialValue: null,
    readOnly: false,
    displayDateFormat: null,
    displayDateMask: null
};

DatePickerInputCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    dayPickerProps: PropTypes.object,
    lang: PropTypes.oneOf(['fr', 'en', 'de']).isRequired,
    variant: PropTypes.oneOf(['date', 'datetime']),
    initialValue: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    displayDateFormat: PropTypes.string,
    displayDateMask: PropTypes.string
};

export const DatePickerInput = withStyles(styles)(DatePickerInputCmp);

DatePickerInput.displayName = 'DatePickerInput';
