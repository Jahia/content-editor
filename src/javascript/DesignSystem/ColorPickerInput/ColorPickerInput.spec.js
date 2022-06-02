import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {ColorPickerInput} from './ColorPickerInput';

describe('ColorPickerInput', () => {
    let props;
    beforeEach(() => {
        props = {
            onChange: jest.fn()
        };
    });

    it('should display colorPicker input', () => {
        const cmp = shallowWithTheme(
            <ColorPickerInput initialValue="#fff" {...props}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('WithStyles(Popover)').props().open).toBe(false);
        expect(cmp.find('Input').props().value).toBe('#fff');
        expect(cmp.find('Input').props().readOnly).toBe(false);
        cmp.find('Input').simulate('change', {target: {name: 'width', value: '#000'}});
        expect(props.onChange.mock.calls.length).toBe(1);
        expect(props.onChange).toHaveBeenCalledWith('#000');
    });

    it('should be readonly in case props say so', () => {
        const cmp = shallowWithTheme(
            <ColorPickerInput readOnly initialValue="#fff" {...props}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('Input').props().readOnly).toBe(true);
    });
});
