import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {MediaPickerEmpty} from './MediaPicker_empty';

describe('mediaPicker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            idInput: 'idInput',
            context: {
                site: 'mySite',
                lang: 'en'
            },
            onImageSelection: jest.fn()
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

        cmp.find('[idInput="idInput"]').props().onCloseDialog();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should setModalOpen to false when imageIsSelected', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        cmp.find('[idInput="idInput"]').simulate('imageSelection');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should trigger onImageSelection whend imageIsSelected', () => {
        const cmp = shallowWithTheme(
            <MediaPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        cmp.find('[idInput="idInput"]').simulate('imageSelection', [{name: 'imageName'}]);

        expect(defaultProps.onImageSelection).toHaveBeenCalledWith([{name: 'imageName'}]);
    });
});
