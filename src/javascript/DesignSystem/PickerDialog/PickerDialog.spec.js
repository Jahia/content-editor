import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {PickerDialog} from './PickerDialog';
import Button from '@material-ui/core/Button';

describe('picker modal', () => {
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
            nodeTreeConfigs: [],
            loading: false,
            selectedPath: '',
            setSelectedPath: jest.fn(),
            onItemSelection: jest.fn(),
            onCloseDialog: jest.fn(),
            onImageSelection: jest.fn()
        };
    });

    it('should not display ProgressOverlay when loading is not completed', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(false);
    });

    it('should display ProgressOverlay when loading is not completed', () => {
        defaultProps.loading = true;
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('WithStyles(ProgressOverlayCmp)').exists()).toBe(true);
    });

    it('should close the modal when click on Cancel button', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(Button)[color="secondary"]').simulate('click');

        expect(defaultProps.onCloseDialog).toHaveBeenCalled();
    });

    it('should disabled button when no item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', false);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(true);
    });

    it('should not disabled button when item is selected', () => {
        const cmp = shallowWithTheme(
            <PickerDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('WithStyles(Button)[id="select-item"]').simulate('click', true);

        expect(cmp.find('WithStyles(Button)[variant="contained"]').props().disabled).toBe(false);
    });
});
