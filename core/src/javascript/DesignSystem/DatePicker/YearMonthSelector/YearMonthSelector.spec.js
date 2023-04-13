import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {YearMonthSelector} from './YearMonthSelector';

describe('YearAndMonthSelector', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            date: new Date(),
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            onChange: jest.fn(),
            disabledDays: []
        };
    });

    it('should display year and month selectors', () => {
        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsSelect').at(0).props().value).toBe(defaultProps.date.getMonth());
        expect(cmp.find('DsSelect').at(1).props().value).toBe(defaultProps.date.getFullYear());
    });

    it('should update month/year in date when selecting a month/year', () => {
        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        const monthSelector = cmp.find('DsSelect').at(0);
        const yearSelector = cmp.find('DsSelect').at(1);

        // Simulate change month
        monthSelector.simulate('change', {
            target: {
                name: 'month',
                value: '5'
            }
        });

        // Check onChange called
        expect(defaultProps.onChange).toHaveBeenCalledWith(new Date(defaultProps.date.getFullYear(), 5));

        // Simulate change year
        yearSelector.simulate('change', {
            target: {
                name: 'year',
                value: '2050'
            }
        });

        // Check onChange called
        expect(defaultProps.onChange).toHaveBeenCalledWith(new Date(2050, defaultProps.date.getMonth()));
    });

    it('should support before date', () => {
        defaultProps.disabledDays = [{before: new Date('1972-11-22T03:03')}];

        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsSelect').at(1).debug()).toContain('1972');
        expect(cmp.find('DsSelect').at(1).debug()).not.toContain('1971');
        expect(cmp.find('DsSelect').at(1).debug()).toContain('2036');
    });

    it('should support after date', () => {
        defaultProps.disabledDays = [{after: new Date('2035-11-22T03:03')}];

        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsSelect').at(1).debug()).toContain('2035');
        expect(cmp.find('DsSelect').at(1).debug()).not.toContain('2036');
    });

    it('should support before and after date', () => {
        defaultProps.disabledDays = [
            {before: new Date('2019-11-22T03:03')},
            {after: new Date('2021-11-22T03:03')}
        ];

        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsSelect').at(1).children().debug()).not.toContain('2018');
        expect(cmp.find('DsSelect').at(1).children().debug()).toContain('2019');
        expect(cmp.find('DsSelect').at(1).children().debug()).toContain('2020');
        expect(cmp.find('DsSelect').at(1).children().debug()).toContain('2021');
        expect(cmp.find('DsSelect').at(1).children().debug()).not.toContain('2022');
    });
});
