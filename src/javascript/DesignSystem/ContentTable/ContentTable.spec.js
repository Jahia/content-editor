import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import ContentTable from './ContentTable';

describe('ContentTable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            data: [
                {id: '1', name: 'name 1', path: 'path1', type: 'type 1', createdBy: 'createdBy 1', lastModified: 'lastModified 1', props: {type: {onClick: jest.fn()}}},
                {id: '2', name: 'name 2', path: 'path2', type: 'type 2', createdBy: 'createdBy 2', lastModified: 'lastModified 2'}
            ],
            columns: [
                {property: 'name', label: 'Column 1'},
                {property: 'type', label: 'Column 2'},
                {property: 'createdBy', label: 'Column 3'},
                {property: 'lastModified', label: 'Column 4'}
            ],
            order: '',
            orderBy: '',
            labelEmpty: '',
            classes: {}
        };
    });

    it('should display ContentTable when data is not empty', () => {
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(Table)').exists();
    });

    it('should display EmptyTable when data is empty', () => {
        defaultProps.data = [];
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(EmptyTable)').exists();
    });

    it('should display ContentTableHeader inside the table', () => {
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('ContentTableHeader').exists();
    });

    it('should display table with rows', () => {
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('name 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('name 2');
    });

    it('should display table row', () => {
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('name 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('type 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('createdBy 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('lastModified 1');
    });

    it('should not select initially one row', () => {
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').at(0).props().selected).toBe(false);
    });

    it('should select initially one row', () => {
        defaultProps.initialSelection = ['path1'];
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').at(0).props().selected).toBe(true);
    });

    it('should use renderer of the column when defined initially one row', () => {
        defaultProps.columns[1].renderer = () => 'this is a test';
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('[tableCellData="type 1"]').dive().debug()).toContain('this is a test');
    });

    it('should add props to renderer component', () => {
        defaultProps.columns[1].renderer = () => 'this is a test';
        const cmp = shallowWithTheme(
            <ContentTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('[tableCellData="type 1"]').props().onClick).toBe(defaultProps.data[0].props.type.onClick);
    });
});
