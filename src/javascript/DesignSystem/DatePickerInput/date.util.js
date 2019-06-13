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

export const processJCRBoundary = (isDateTime, selectedDate, toBeProcessBoundary, disabledDays, disabledHours, boundaryName, offset) => {
    if (toBeProcessBoundary[boundaryName] && toBeProcessBoundary[boundaryName].date) {

        // TODO disable the after or before days using after or before notation
        // Todo disabledDays.push({'after': toBeProcessBoundary[boundaryName].date})

        let date = dayjs(toBeProcessBoundary[boundaryName].date);

        // disable the exact date
        if (!isDateTime && toBeProcessBoundary[boundaryName].include) {
            disabledDays.push(toBeProcessBoundary[boundaryName].date);
        }

        // disable the hours using before or after notation
        if (isDateTime && date.format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD')) {
            disabledHours[boundaryName] = toBeProcessBoundary[boundaryName].include ?
                date.add(offset, 'minute').format('HH:mm') :
                date.format('HH:mm');
        }
    }
};

export const extractDatesAndHours = (isDateTime, selectedDate, incomingDisabledDays) => {
    const disabledHours = {};
    const disabledDays = [];

    // Todo remove loop
    incomingDisabledDays.forEach(disabledDay => {
        const disabled = {};

        if (disabledDay instanceof Date) {
            // TODO remove handling of Day-picker props
            disabledDays.push(disabledDay);
        } else {
            processJCRBoundary(isDateTime, selectedDate, disabledDay, disabledDays, disabledHours, 'before', 1);
            processJCRBoundary(isDateTime, selectedDate, disabledDay, disabledDays, disabledHours, 'after', -1);

            // TODO remove handling of Day-picker props
            if (disabledDay.before || disabledDay.after) {
                if (disabledDay.before) {
                    disabled.before = disabledDay.before.date || disabledDay.before;
                }

                if (disabledDay.after) {
                    disabled.after = disabledDay.after.date || disabledDay.after;
                }

                disabledDays.push(disabled);
            }
        }
    });

    return {disabledDays, disabledHours};
};
