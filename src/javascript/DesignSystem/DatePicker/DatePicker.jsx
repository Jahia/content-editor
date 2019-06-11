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
    ...props
}) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedHour, setSelectedHour] = useState('0:00');

    const locale = locales[lang] || {};

    const selectedDate = selectedDateTime ? [selectedDateTime] : selectedDays;
    const isDateTime = variant === 'datetime';

    return (
        <div className={classes.container + ' ' + (isDateTime ? classes.containerDateTime : '')}>
            <DayPicker
                locale={lang}
                selectedDays={selectedDate}
                month={selectedDate[0] || new Date()}
                months={locale.months}
                weekdaysLong={locale.weekdays}
                weekdaysShort={locale.weekdaysShort}
                firstDayOfWeek={locale.weekStart || 0}
                onDayClick={day => {
                    setSelectedDays([day]);
                    onSelectDateTime(getDateTime(day, selectedHour));
                }}
                {...props}
            />
            {isDateTime && (
                <TimeSelector
                    selectedHour={
                        selectedDateTime ?
                            dayjs(selectedDateTime).format('h:mm') :
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
    selectedDateTime: null
};

DatePickerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
    lang: PropTypes.oneOf(['fr', 'en', 'de']).isRequired,
    variant: PropTypes.oneOf(['date', 'datetime']),
    onSelectDateTime: PropTypes.func,
    selectedDateTime: PropTypes.object
};

export const DatePicker = withStyles(style)(DatePickerCmp);

DatePicker.displayName = 'DatePicker';
