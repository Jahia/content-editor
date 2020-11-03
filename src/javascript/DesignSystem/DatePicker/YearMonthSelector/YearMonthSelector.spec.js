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
            onChange: jest.fn()
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
});
