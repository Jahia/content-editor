import React, {useState} from 'react';
import PropTypes from 'prop-types';

import DayPicker from 'react-day-picker';
import {TimeSelector} from './TimeSelector/TimeSelector';
import {style} from './DatePicker.style';
import {withStyles} from '@material-ui/core/styles';

import frLocale from 'dayjs/locale/fr';
import deLocale from 'dayjs/locale/de';
import enLocale from 'dayjs/locale/en';

import dayjs from 'dayjs';

const generateWeekdaysShort = locale => {
    return {
        ...locale,
        weekdaysShort: locale.weekdays.map(day => day[0])
    };
};

const locales = {
    fr: generateWeekdaysShort(frLocale),
    de: generateWeekdaysShort(deLocale),
    en: generateWeekdaysShort(enLocale)
};

function getDateTime(day, hour) {
    const [hourParsed, minutes] = hour.split(':');
    return dayjs(day)
        .hour(Number(hourParsed))
        .minute(Number(minutes))
        .toDate();
}

const DatePickerCmp = ({
    lang,
    variant,
    classes,
    onSelectDateTime,
    selectedDateTime,
    disabledDays: incomingDisableDays,
    ...props
}) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedHour, setSelectedHour] = useState('00:00');
    const isDateTime = variant === 'datetime';

    const locale = locales[lang] || {};

    const selectedDate = selectedDateTime ? [selectedDateTime] : selectedDays;
    let disabledHours = {};
    const disabledDays = [];
    const extractDateAndHours = (entry, boundIncludeOffset) => {
        return {
            date: !isDateTime && entry.include ? entry.date : undefined,
            hours: isDateTime && dayjs(entry.date).format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD') ? dayjs(entry.date).add(entry.include ? boundIncludeOffset : 0, 'minute').format('HH:mm') : undefined
        };
    };

    const disabled = {};
    incomingDisableDays.forEach(entry => {
        if (entry instanceof Date) {
            disabledDays.push(entry);
        } else {
            if (entry.before) {
                disabled.before = entry.before.date || entry.before;
                let {date: dateBefore, hours: hoursBefore} = extractDateAndHours(entry.before, 1);
                if (dateBefore) {
                    disabledDays.push(dateBefore);
                }

                if (hoursBefore) {
                    disabledHours.before = hoursBefore;
                }
            }

            if (entry.after) {
                disabled.after = entry.after.date || entry.after;
                let {date: dateAfter, hours: hoursAfter} = extractDateAndHours(entry.after, -1);
                if (dateAfter) {
                    disabledDays.push(dateAfter);
                }

                if (hoursAfter) {
                    disabledHours.after = hoursAfter;
                }
            }
        }
    });
    disabledDays.push(disabled);
    console.log('picker disabledDays', disabled);
    return (
        <div className={classes.container + ' ' + (isDateTime ? classes.containerDateTime : '')}>
            <DayPicker
                locale={lang}
                disabledDays={disabledDays}
                selectedDays={selectedDate}
                months={locale.months}
                weekdaysLong={locale.weekdays}
                weekdaysShort={locale.weekdaysShort}
                firstDayOfWeek={locale.weekStart || 0}
                onDayClick={(day, modifiers) => {
                    if (modifiers && modifiers.disabled) {
                        return;
                    }

                    setSelectedDays([day]);
                    onSelectDateTime(getDateTime(day, selectedHour));
                }}
                {...props}
            />
            {isDateTime && (
                <TimeSelector
                    disabledHours={disabledHours}
                    selectedHour={
                        selectedDateTime ?
                            dayjs(selectedDateTime).format('HH:mm') :
                            selectedHour
                    }
                    onHourSelected={hour => {
                        onSelectDateTime(getDateTime(selectedDays[0], hour));
                        setSelectedHour(hour);
                    }}
                />
            )}
        </div>
    );
};

DatePickerCmp.defaultProps = {
    variant: 'date',
    onSelectDateTime: () => {},
    selectedDateTime: null,
    disabledDays: []
};

DatePickerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    lang: PropTypes.oneOf(['fr', 'en', 'de']).isRequired,
    variant: PropTypes.oneOf(['date', 'datetime']),
    disabledDays: PropTypes.array,
    onSelectDateTime: PropTypes.func,
    selectedDateTime: PropTypes.object
};

export const DatePicker = withStyles(style)(DatePickerCmp);

DatePicker.displayName = 'DatePicker';
