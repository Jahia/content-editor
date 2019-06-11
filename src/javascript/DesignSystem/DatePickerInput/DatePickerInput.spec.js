import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DatePickerInput} from './DatePickerInput';

describe('DatePickerInput', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'fr'
        };
    });

    it('should display datepicker on button click', () => {
        const cmp = shallowWithTheme(
            <DatePickerInput {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().find('WithStyles(Popover)').props().open).toBe(false);

        // Simulate click on date picker icon
        // expect(cmp.dive().find('WithStyles(Popover)').props().open).toBe(true);
    });
});
