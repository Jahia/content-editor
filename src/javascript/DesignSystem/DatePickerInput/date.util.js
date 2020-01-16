// Look at https://github.com/MadMG/moment-jdateformatparser/blob/master/moment-jdateformatparser.js
// for the javaFormatMapping

import dayjs from 'dayjs';

export const generateWeekdaysShort = locale => {
    return {
        ...locale,
        weekdaysShort: locale.weekdays.map(day => day[0].toUpperCase())
    };
};

export const getDateTime = (day, hour) => {
    const [hourParsed, minutes] = hour.split(':');
    return dayjs(day)
        .hour(Number(hourParsed))
        .minute(Number(minutes))
        .toDate();
};

export const getHourFromDisabledDays = (selectedDate, disabledDays, boundaryName) => {
    // Extract the hour from the matching disabled day from disabledDays
    // If several dates from disabledDays match the selectedDate for a boundaryName the last one is returned
    let hour;
    disabledDays.forEach(disabledDay => {
        let date = disabledDay[boundaryName];
        let day = dayjs(date).format('YYYYMMDD');
        let currentDay = dayjs(selectedDate).format('YYYYMMDD');
        if (date && day === currentDay) {
            hour = dayjs(date).format('HH:mm');
        }
    });
    return hour;
};

export const hours = disabledHours => new Array(48).fill().reduce((acc, _, i) => {
    // Compute hour from the loop entry
    const hour = `${(Math.floor(i / 2) < 10 ? '0' : '') + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`;

    if (disabledHours && (disabledHours.after || disabledHours.before)) {
        // Transform it as integer
        const hourAsInt = hour.split(':').join('');
        // Transform hours to int to compare them
        const afterHourAsInt = disabledHours.after ? disabledHours.after.split(':').join('') : 9999;
        const beforeHourAsInt = disabledHours.before ? disabledHours.before.split(':').join('') : -1;

        if (hourAsInt >= beforeHourAsInt && hourAsInt <= afterHourAsInt) {
            acc.push(hour);
        }
    } else {
        acc.push(hour);
    }

    return acc;
}, []);
