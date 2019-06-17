// Look at https://github.com/MadMG/moment-jdateformatparser/blob/master/moment-jdateformatparser.js
// for the javaFormatMapping

import dayjs from 'dayjs';

const javaFormatMapping = {
    d: 'D',
    dd: 'DD',
    y: 'YYYY',
    yy: 'YY',
    yyy: 'YYYY',
    yyyy: 'YYYY',
    a: 'a',
    A: 'A',
    M: 'M',
    MM: 'MM',
    MMM: 'MMM',
    MMMM: 'MMMM',
    h: 'h',
    hh: 'hh',
    H: 'H',
    HH: 'HH',
    m: 'm',
    mm: 'mm',
    s: 's',
    ss: 'ss',
    S: 'SSS',
    SS: 'SSS',
    SSS: 'SSS',
    E: 'ddd',
    EE: 'ddd',
    EEE: 'ddd',
    EEEE: 'dddd',
    EEEEE: 'dddd',
    EEEEEE: 'dddd',
    D: 'DDD',
    w: 'W',
    ww: 'WW',
    z: 'ZZ',
    zzzz: 'Z',
    Z: 'ZZ',
    X: 'ZZ',
    XX: 'ZZ',
    XXX: 'Z',
    u: 'E'
};

const translateFormat = (formatString, mapping) => {
    const len = formatString.length;
    let i = 0;
    let startIndex = -1;
    let lastChar = null;
    let currentChar = '';
    let resultString = '';

    for (; i < len; i++) {
        currentChar = formatString.charAt(i);

        if (lastChar === null || lastChar !== currentChar) {
            // Change detected
            resultString = _appendMappedString(formatString, mapping, startIndex, i, resultString);

            startIndex = i;
        }

        lastChar = currentChar;
    }

    return _appendMappedString(formatString, mapping, startIndex, i, resultString);
};

// eslint-disable-next-line
const _appendMappedString = (formatString, mapping, startIndex, currentIndex, resultString) => {
    if (startIndex !== -1) {
        let tempString = formatString.substring(startIndex, currentIndex);

        // Check if the temporary string has a known mapping
        if (mapping[tempString]) {
            tempString = mapping[tempString];
        }

        resultString += tempString;
    }

    return resultString;
};

export const javaDateFormatToJSDF = javaFormat => {
    if (!javaFormat) {
        return javaFormat;
    }

    let mapped = '';
    let regexp = /[^']+|('[^']*')/g;
    let part = '';

    while ((part = regexp.exec(javaFormat))) {
        part = part[0];

        if (part.match(/'(.*?)'/)) {
            mapped += '[' + part.substring(1, part.length - 1) + ']';
        } else {
            mapped += translateFormat(part, javaFormatMapping);
        }
    }

    return mapped;
};

export const generateWeekdaysShort = locale => {
    return {
        ...locale,
        weekdaysShort: locale.weekdays.map(day => day[0])
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
