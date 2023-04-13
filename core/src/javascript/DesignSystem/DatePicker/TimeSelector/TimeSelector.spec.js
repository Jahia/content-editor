import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {TimeSelector} from './TimeSelector';

describe('TimeSelector', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            onHourSelected: jest.fn()
        };
    });

    it('should display each hour of a day', () => {
        const cmp = shallowWithTheme(
            <TimeSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        new Array(24)
            .fill()
            .map((_, i) => i)
            .forEach(hour => {
                expect(cmp.debug()).toContain(`${hour}:00`);
            });
    });

    it('should display each half hour of a day', () => {
        const cmp = shallowWithTheme(
            <TimeSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        new Array(24)
            .fill()
            .map((_, i) => i)
            .forEach(hour => {
                expect(cmp.debug()).toContain(`${hour}:30`);
            });
    });

    it('should trigger onHourSelected when clicking on hour', () => {
        const cmp = shallowWithTheme(
            <TimeSelector {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('DsTypography')
            .at(0)
            .simulate('click');

        expect(defaultProps.onHourSelected).toHaveBeenCalledWith('00:00');
    });

    it('should not contain disabled hours', () => {
        const disabledHours = {before: '02:01', after: '22:00'};
        const cmp = shallowWithTheme(
            <TimeSelector disabledHours={disabledHours} {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        ['00:00', '00:30', '01:00', '01:30', '02:00', '22:30', '23:00', '23:30'].forEach(
            date => expect(cmp.debug()).not.toContain(date)
        );
        ['02:30', '22:00'].forEach(
            date => expect(cmp.debug()).toContain(date)
        );
    });
});
