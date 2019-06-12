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

        expect(defaultProps.onHourSelected).toHaveBeenCalledWith('0:00');
    });
});
