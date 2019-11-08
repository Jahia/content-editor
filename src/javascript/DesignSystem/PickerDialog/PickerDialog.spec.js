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
            nodeTreeConfigs: [{
                key: 'is the win',
                rootPath: '/contents',
                selectableTypes: [],
                openableTypes: []
            }],
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

        cmp.find('WithStyles(Button)[variant="secondary"]').simulate('click');

        expect(defaultProps.onCloseDialog).toHaveBeenCalled();
    });

    it('should not display the drawer when drawerOpen is false', () => {
        const cmpDrawerOpen = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmpDrawerOpen.find('WithStyles(Drawer)').exists()).toBe(true);

        const cmpDrawerClose = shallowWithTheme(
            <PickerDialog {...defaultProps} displayTree={false}/>,
            {},
            dsGenericTheme
        ).dive();
        expect(cmpDrawerClose.find('WithStyles(Drawer)').exists()).toBe(false);
    });

    it('should disabled button when no item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', {name: 'toto.js'});
        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', null);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(true);
    });

    it('should disabled button when no item is selected on a multiple select', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', [{name: 'toto.js'}]);
        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', []);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(true);
    });

    it('should not disabled button when items is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', [{name: 'toto.jpg'}]);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(false);
    });

    it('should not disabled button when item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', {name: 'toto.jpg'});

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(false);
    });

    it('should not send anything when no new value is selected', () => {
        defaultProps.initialSelectedItem = 'toto.jpg';
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[variant="contained"]').simulate('click');

        expect(defaultProps.onImageSelection).not.toHaveBeenCalled();
        expect(defaultProps.onCloseDialog).toHaveBeenCalled();
    });

    it('should disable select button when unselect initial value', () => {
        defaultProps.initialSelectedItem = 'toto.jpg';
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', []);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(true);
    });

    it('should initialize NodeTrees openPaths with empty array when no initialPath is given', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const nodeTreesCmp = cmp.find('WithStyles(NodeTreesCmp)').dive().dive();
        expect(nodeTreesCmp.find('Picker').props().openPaths).toEqual([]);
    });

    it('should open each NodeTrees parent path when initialPath is given', () => {
        defaultProps.initialSelectedItem = '/sites/mySite/files/background/cats/cat.png';
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        const nodeTreesCmp = cmp.find('WithStyles(NodeTreesCmp)').dive().dive();
        expect(nodeTreesCmp.find('Picker').props().openPaths).toEqual(['/sites/mySite', '/sites/mySite/files', '/sites/mySite/files/background']);
    });
});
