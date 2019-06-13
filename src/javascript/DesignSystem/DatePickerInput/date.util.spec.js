import {
    extractDateAndHours,
    extractDatesAndHours,
    generateWeekdaysShort,
    getDateTime,
    javaDateFormatToJSDF
} from './date.util';
import frLocale from 'dayjs/locale/fr';

describe('date util', () => {
    it('should return null when send null', () => {
        expect(javaDateFormatToJSDF(null)).toBe(null);
    });

    it('should return javscript date format', () => {
        expect(javaDateFormatToJSDF('yyyy-MM-dd HH:mm')).toBe('YYYY-MM-DD HH:mm');
    });

    it('should generateWeekdaysShort returns what expected', () => {
        expect(generateWeekdaysShort(frLocale).weekdaysShort).toEqual(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
    });

    it('should getDateTime returns what expected', () => {
        expect(getDateTime(new Date('1972-11-22'), '05:10')).toEqual(new Date('1972-11-22T05:10:00'));
    });

    it('should extractDateAndHours returns what expected', () => {
        let isDateTime = true;
        const day = {date: new Date('1972-11-22T05:00:00'), include: true};
        const selectedDate = [new Date('1972-11-22T00:00:00')];
        const boundIncludeOffset = 1;

        let res = extractDateAndHours(isDateTime, selectedDate, day, boundIncludeOffset);
        expect(res).toEqual({date: undefined, hours: '05:01'});

        isDateTime = false;
        res = extractDateAndHours(isDateTime, selectedDate, day, boundIncludeOffset);
        expect(res).toEqual({date: day.date, hours: undefined});

        day.include = false;
        res = extractDateAndHours(isDateTime, selectedDate, day, boundIncludeOffset);
        expect(res).toEqual({date: undefined, hours: undefined});

        isDateTime = true;
        res = extractDateAndHours(isDateTime, selectedDate, day, boundIncludeOffset);
        expect(res).toEqual({date: undefined, hours: '05:00'});
    });

    it('should extractDatesAndHours returns what expected', () => {
        const before = {
            date: new Date('1972-11-22T05:00:00'),
            include: false
        };
        const after = {
            date: new Date('2019-11-22T06:00:00'),
            include: false
        };
        const incomingDisabledDays = [{before, after}];
        let isDateTime = false;
        let selectedDate = new Date('1972-11-22T00:00:00');
        let res = extractDatesAndHours(isDateTime, selectedDate, incomingDisabledDays);
        expect(res).toEqual({
            disabledDays: [
                {
                    before: before.date,
                    after: after.date
                }
            ],
            disabledHours: {}
        });

        isDateTime = true;
        res = extractDatesAndHours(isDateTime, selectedDate, incomingDisabledDays);
        expect(res).toEqual({
            disabledDays: [
                {
                    before: before.date,
                    after: after.date
                }
            ],
            disabledHours: {before: '05:00'}
        });

        incomingDisabledDays[0].before.include = true;
        res = extractDatesAndHours(isDateTime, selectedDate, incomingDisabledDays);
        expect(res).toEqual({
            disabledDays: [
                {
                    before: before.date,
                    after: after.date
                }
            ],
            disabledHours: {before: '05:01'}
        });
    });
});
