import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DatePicker} from './DatePicker';

describe('DatePicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'fr'
        };
    });

    it('should display L for Lundi in french for the first day', () => {
        const cmp = shallowWithTheme(
            <DatePicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('DayPicker');

        expect(cmp.props().weekdaysShort[cmp.props().firstDayOfWeek]).toEqual(
            'L'
        );
    });

    it('should display S for Sunday in english for the first day', () => {
        defaultProps.lang = 'en';
        const cmp = shallowWithTheme(
            <DatePicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('DayPicker');

        expect(cmp.props().weekdaysShort[cmp.props().firstDayOfWeek]).toEqual(
            'S'
        );
    });

    it('should not select a day at first place', () => {
        const cmp = shallowWithTheme(
            <DatePicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('DayPicker');

        expect(cmp.props().selectedDays).toEqual([]);
    });

    it('should select on day', () => {
        const cmp = shallowWithTheme(
            <DatePicker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const date = new Date();
        cmp.find('DayPicker').simulate('dayClick', date);

        expect(cmp.find('DayPicker').props().selectedDays).toEqual([date]);
    });

    it('should still support disabledDays', () => {
        const disabledDays = [new Date(), {before: new Date(), after: new Date()}];
        const cmp = shallowWithTheme(
            <DatePicker disabledDays={disabledDays} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const date = new Date();
        cmp.find('DayPicker').simulate('dayClick', date);

        expect(cmp.find('DayPicker').props().disabledDays).toEqual(disabledDays);
    });

    it('should support custom disabledDays', () => {
        const disabledDays = [{before: {date: new Date(), include: true}}];
        const cmp = shallowWithTheme(
            <DatePicker disabledDays={disabledDays} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DayPicker').props().disabledDays).toEqual([disabledDays[0].before.date, {before: disabledDays[0].before.date}]);
    });

    it('should support disableHours', () => {
        const disabledDays = [{before: {date: new Date('1972-11-22T03:03'), include: true}}];
        const cmp = shallowWithTheme(
            <DatePicker selectedDateTime={new Date('1972-11-22')} variant="datetime" disabledDays={disabledDays} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('TimeSelector').props().disabledHours).toEqual({before: '03:04'});
    });
});
