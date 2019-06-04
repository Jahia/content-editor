import {dsGenericTheme} from '@jahia/ds-mui-theme';
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
});
