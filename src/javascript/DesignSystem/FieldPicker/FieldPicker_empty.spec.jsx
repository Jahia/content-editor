import React from 'react';

import ImageIcon from '@material-ui/icons/Image';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {FieldPickerEmpty} from './FieldPicker_empty';

describe('fieldPicker empty', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            idInput: 'idInput',
            editorContext: {
                site: 'mySite',
                lang: 'en'
            },
            PickerIcon: <ImageIcon/>,
            onSelection: jest.fn(),
            picker: () => <div>picker</div>
        };
    });

    it('should set modal not open by default', () => {
        const cmp = shallowWithTheme(
            <FieldPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should set modal open when clicking on the button', () => {
        const cmp = shallowWithTheme(
            <FieldPickerEmpty {...defaultProps}/>,
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
            <FieldPickerEmpty {...defaultProps} readOnly/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should setModalOpen to false when isSelected', () => {
        const cmp = shallowWithTheme(
            <FieldPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        cmp.find('[idInput="idInput"]').simulate('selection');

        expect(cmp.find('WithStyles(Dialog)').props().open).toBe(false);
    });

    it('should trigger onSelection when isSelected', () => {
        const cmp = shallowWithTheme(
            <FieldPickerEmpty {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('button').simulate('click');

        cmp.find('[idInput="idInput"]').simulate('selection', [{name: 'item name'}]);

        expect(defaultProps.onSelection).toHaveBeenCalledWith([{name: 'item name'}]);
    });
});
