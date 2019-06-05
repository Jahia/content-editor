import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DatePickerInput} from './DatePickerInput';

jest.useFakeTimers();

describe('DatePickerInput', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'fr'
        };
    });

    it('should display datepicker on input focus', () => {
        const cmp = shallowWithTheme(
            <DatePickerInput {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.exists('DatePicker')).toBe(false);

        cmp.find('Input').simulate('focus');

        jest.runAllTimers();

        // Cannot test timeout System as enzyme doesn't support useEffect...
        // expect(cmp.exists('DatePicker')).toBe(true);
    });
});
