import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DatePicker} from './DatePicker';

describe('DatePicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'fr',
            onSelectDateTime: jest.fn()
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

        date.setHours(0);
        date.setMinutes(0);
        expect(defaultProps.onSelectDateTime).toHaveBeenCalledWith(date);
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

    it('should select current month if no date is selected', () => {
        const OldDate = Date;
        const freezedTime = new Date();
        global.Date = jest.fn(function () {
            return freezedTime;
        });

        const cmp = shallowWithTheme(
            <DatePicker {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const cmpMonth = cmp.find('DayPicker').props().month;
        expect(cmpMonth).toEqual(freezedTime);

        global.Date = OldDate;
    });

    it('should initialize DayPicker with selectededDate month', () => {
        const selectedDateTime = new Date(1972, 11);
        const cmp = shallowWithTheme(
            <DatePicker selectedDateTime={selectedDateTime} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const cmpMonth = cmp.find('DayPicker').props().month;
        expect(cmpMonth).toEqual(selectedDateTime);
    });

    it('should support disableHours', () => {
        const disabledDays = [{before: new Date('1972-11-22T03:03')}];
        const cmp = shallowWithTheme(
            <DatePicker selectedDateTime={new Date('1972-11-22T03:00')} variant="datetime" disabledDays={disabledDays} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('TimeSelector').props().disabledHours).toEqual({before: '03:03', after: undefined});
    });
});
