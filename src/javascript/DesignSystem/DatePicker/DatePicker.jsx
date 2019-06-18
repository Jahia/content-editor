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
import {
    generateWeekdaysShort,
    getDateTime,
    getHourFromDisabledDays
} from '../DatePickerInput/date.util';

const locales = {
    fr: generateWeekdaysShort(frLocale),
    de: generateWeekdaysShort(deLocale),
    en: generateWeekdaysShort(enLocale)
};

const DatePickerCmp = ({
    lang,
    variant,
    classes,
    onSelectDateTime,
    selectedDateTime,
    disabledDays,
    ...props
}) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedHour, setSelectedHour] = useState('00:00');
    const isDateTime = variant === 'datetime';
    const locale = locales[lang] || {};

    const selectedDate = selectedDateTime ? [selectedDateTime] : selectedDays;

    return (
        <div className={classes.container + ' ' + (isDateTime ? classes.containerDateTime : '')}>
            <DayPicker
                locale={lang}
                disabledDays={disabledDays}
                selectedDays={selectedDate}
                month={(selectedDate && selectedDate.length > 0) ? new Date(selectedDate[0]) : new Date()}
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
                    disabledHours={{
                        before: getHourFromDisabledDays(selectedDate[0], disabledDays, 'before'),
                        after: getHourFromDisabledDays(selectedDate[0], disabledDays, 'after')
                    }}
                    selectedHour={
                        selectedDateTime ?
                            dayjs(selectedDateTime).format('HH:mm') :
                            selectedHour
                    }
                    onHourSelected={hour => {
                        onSelectDateTime(getDateTime(selectedDate[0], hour));
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
