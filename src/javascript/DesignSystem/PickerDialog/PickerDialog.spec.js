import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {PickerDialog} from './PickerDialog';
import Button from '@material-ui/core/Button';

describe('Picker dialog', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            idInput: 'IDdd',
            site: 'mySite',
            lang: 'en',
            children: setSelectedItem => (
                <>
                    <Button id="select-item" onClick={selected => setSelectedItem(selected)}>Select item</Button>
                </>
            ),
            nodeTreeConfigs: [{rootPath: '/contents'}],
            onItemSelection: jest.fn(),
            onCloseDialog: jest.fn(),
            onImageSelection: jest.fn(),
            modalCancelLabel: '',
            modalDoneLabel: ''
        };
    });

    it('should close the modal when click on Cancel button', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[color="secondary"]').simulate('click');

        expect(defaultProps.onCloseDialog).toHaveBeenCalled();
    });

    it('should disabled button when no item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', false);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(true);
    });

    it('should not disabled button when item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', true);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(false);
    });

    it('should initialize NodeTrees openPaths with empty array when no initialPath is given', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(NodeTreesCmp)').props().openPaths).toEqual([]);
    });

    it('should open each NodeTrees parent path when initialPath is given', () => {
        defaultProps.initialSelectedItem = '/sites/mySite/files/background/cats/cat.png';
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(NodeTreesCmp)').props().openPaths).toEqual(['/sites/mySite', '/sites/mySite/files', '/sites/mySite/files/background']);
    });
});
