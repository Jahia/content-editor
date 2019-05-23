import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import ContentTable from './ContentTable';

describe('ContentTable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            data: [
                {id: '1', name: 'name 1', type: 'type 1', createdBy: 'createdBy 1', lastModified: 'lastModified 1'},
                {id: '2', name: 'name 2', type: 'type 2', createdBy: 'createdBy 2', lastModified: 'lastModified 2'}
            ],
            columns: [
                {id: '1', label: 'Column 1'},
                {id: '2', label: 'Column 2'}
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
});
