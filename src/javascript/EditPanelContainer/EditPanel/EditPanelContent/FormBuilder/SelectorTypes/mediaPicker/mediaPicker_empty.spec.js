import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {MediaPickerEmpty} from './mediaPicker_empty';

describe('mediaPicker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
        };
    });

    it('should set modal not open by default', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should set modal open when clicking on the button', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(true);
    });

    it('should give onCloseDialog props to the modal that close the Dialog', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        cmp.find('WithStyles(ModalCmp)').props().onCloseDialog();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });
});
