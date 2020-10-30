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

        expect(cmp.find('select').at(0).props().value).toBe(defaultProps.date.getMonth());
        expect(cmp.find('select').at(1).props().value).toBe(defaultProps.date.getFullYear());
    });

    it('should update month/year in date when selecting a month/year', () => {
        const cmp = shallowWithTheme(
            <YearMonthSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        const monthSelector = cmp.find('select').at(0);

        // Simulate change year/month
        monthSelector.simulate('change', {
            target: {
                form: {
                    month: {
                        value: 5
                    },
                    year: {
                        value: 2050
                    }
                }
            }
        });

        // Check onChange called
        expect(defaultProps.onChange).toHaveBeenCalledWith(new Date(2050, 5));
    });
});
