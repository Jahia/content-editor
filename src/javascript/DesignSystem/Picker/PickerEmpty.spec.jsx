import React from 'react';

import ImageIcon from '@material-ui/icons/Image';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {PickerEmpty} from './PickerEmpty';

describe('picker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            pickerLabel: '',
            PickerIcon: <ImageIcon/>,
            children: jest.fn(),
            classes: {}
        };
    });

    it('should set modal not open by default', () => {
        const cmp = shallowWithTheme(
            <PickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should set modal open when clicking on the button', () => {
        const cmp = shallowWithTheme(
            <PickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should not set modal open when clicking on the button when readOnly', () => {
        const cmp = shallowWithTheme(
            <PickerEmpty {...defaultProps} readOnly/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });
});
