import {generateWeekdaysShort, getDateTime, getHourFromDisabledDays, hours} from './date.util';
import frLocale from 'dayjs/locale/fr';

describe('date util', () => {
    it('should generateWeekdaysShort returns what expected', () => {
        expect(generateWeekdaysShort(frLocale).weekdaysShort).toEqual(['D', 'L', 'M', 'M', 'J', 'V', 'S']);
    });

    it('should getDateTime returns what expected', () => {
        expect(getDateTime(new Date('1972-11-22T00:00:00'), '05:10')).toEqual(new Date('1972-11-22T05:10:00'));
    });

    it('should getHourFromDisabledDays returns what expected', () => {
        const disabledDays = [
            {before: new Date('1972-11-22T01:10:00')},
            {after: new Date('1972-11-22T02:20:00')}
        ];
        let selectedDate = new Date('1972-11-23T00:00:00');
        let res = getHourFromDisabledDays(selectedDate, disabledDays, 'before');
        expect(res).toEqual(undefined);

        selectedDate = new Date('1972-11-22T00:00:00');
        res = getHourFromDisabledDays(selectedDate, disabledDays, 'before');
        expect(res).toEqual('01:10');
        res = getHourFromDisabledDays(selectedDate, disabledDays, 'after');
        expect(res).toEqual('02:20');
    });

    it('should hours returns what expected', () => {
        const disabledHours = {before: '02:01', after: '22:00'};

        ['00:00', '00:30', '01:00', '01:30', '02:00', '22:30', '23:00', '23:30'].forEach(
            date => expect(hours(disabledHours)).not.toContain(date)
        );
        ['02:30', '22:00'].forEach(
            date => expect(hours(disabledHours)).toContain(date)
        );
    });
});
