import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import React from 'react';
import {ContentRow} from './ContentRow';

describe('ContentRow', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            row: {
                id: '1',
                selectable: true,
                name: 'name 1',
                path: 'path1',
                type: 'type 1',
                createdBy: 'createdBy 1',
                lastModified: 'lastModified 1',
                props: {type: {onClick: jest.fn()}}
            },
            selected: false,
            columns: [
                {property: 'name', label: 'Column 1'},
                {property: 'type', label: 'Column 2'},
                {property: 'createdBy', label: 'Column 3'},
                {property: 'lastModified', label: 'Column 4'}
            ],
            onClick: jest.fn(),
            classes: {}
        };
    });

    it('should display table row', () => {
        const cmp = shallowWithTheme(
            <ContentRow {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('name 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('type 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('createdBy 1');
        expect(cmp.find('WithStyles(TableRow)').debug()).toContain('lastModified 1');
    });

    it('should allow row selection if selectable', () => {
        defaultProps.row.selectable = true;

        const cmp = shallowWithTheme(
            <ContentRow {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').find('WithStyles(Checkbox)').length).toEqual(1);
    });

    it('should not allow row selection if not selectable', () => {
        defaultProps.row.selectable = false;

        const cmp = shallowWithTheme(
            <ContentRow {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('WithStyles(TableRow)').find('WithStyles(Checkbox)').length).toEqual(0);
    });

    it('should use renderer of the column when defined initially one row', () => {
        defaultProps.columns[1].renderer = () => 'this is a test';
        const cmp = shallowWithTheme(
            <ContentRow {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('[tableCellData="type 1"]').dive().debug()).toContain('this is a test');
    });

    it('should add props to renderer component', () => {
        defaultProps.columns[1].renderer = () => 'this is a test';
        const cmp = shallowWithTheme(
            <ContentRow {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('[tableCellData="type 1"]').props().onClick).toBe(defaultProps.row.props.type.onClick);
    });
});
