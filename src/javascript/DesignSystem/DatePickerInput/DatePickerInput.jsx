import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

import {DatePicker} from '../DatePicker';
import {withStyles} from '@material-ui/core/styles';
import {Input} from '../Input';
import {javaDateFormatToJSDF} from './date.util';

import dayjs from 'dayjs';
import IconButton from '@material-ui/core/IconButton/IconButton';
import {DateRange} from '@material-ui/icons';

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
    const [overlayShowed, showOverlay] = useState(false);
    const [datetime, setDatetime] = useState(initialValue);
    const [datetimeString, setDatetimeString] = useState(
        formatDateTime(datetime, lang, variant, displayDateFormat)
    );
    const htmlInput = useRef();

    const [eventQueue, setEventQueue] = useState([]);
    const pushToEventQueue = valueWanted => {
        setEventQueue([...eventQueue, valueWanted]);
    };

    useEffect(() => {
        if (eventQueue.length === 0) {
            return;
        }

        const timeout = setTimeout(() => {
            showOverlay(eventQueue[eventQueue.length - 1]);
            setEventQueue([]);

            // If datepicker overlay is not showed anymore, it's an onblur event
            if (eventQueue[eventQueue.length - 1] === false) {
                onBlur();
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
        };
    }, [eventQueue, onBlur]);

    useEffect(() => {
        setDatetimeString(formatDateTime(datetime, lang, variant, displayDateFormat));
    }, [lang, variant, displayDateFormat]); // eslint-disable-line react-hooks/exhaustive-deps

    const InteractiveVariant = (
        <IconButton disableRipple
                    aria-label="Open date picker"
                    onClick={() => {
                        htmlInput.current.focus();
                    }}
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
                onFocus={() => {
                    if (!readOnly) {
                        pushToEventQueue(true);
                    }
                }}
                onBlur={() => {
                    pushToEventQueue(false);
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
            <div className={classes.overlay}>
                {overlayShowed && (
                    <DatePicker
                        variant={variant}
                        lang={lang}
                        selectedDateTime={datetime}
                        onFocus={() => {
                            pushToEventQueue(true);
                        }}
                        onBlur={() => {
                            pushToEventQueue(false);
                        }}
                        onSelectDateTime={datetime => {
                            onChange(datetime.toISOString());
                            setDatetime(datetime);
                            setDatetimeString(
                                formatDateTime(datetime, lang, variant, displayDateFormat)
                            );
                        }}
                    />
                )}
            </div>
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
