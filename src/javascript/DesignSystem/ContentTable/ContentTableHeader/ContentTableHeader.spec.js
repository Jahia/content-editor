import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {ContentTableHeader} from './ContentTableHeader';

describe('ContentTableHeader', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            columns: [{
                id: '1',
                label: 'Column 1'
            }, {
                id: '2',
                label: 'Column 2'
            }],
            order: '',
            orderBy: ''
        };
    });

    it('should display table head', () => {
        const cmp = shallowWithTheme(
            <ContentTableHeader {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        cmp.find('WithStyles(TableHead)').exists();
    });

    it('should display table head with columns', () => {
        const cmp = shallowWithTheme(
            <ContentTableHeader {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('WithStyles(TableSortLabel)').debug()).toContain('Column 1');
        expect(cmp.find('WithStyles(TableSortLabel)').debug()).toContain('Column 2');
    });
});
