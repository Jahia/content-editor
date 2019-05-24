import {dsGenericTheme} from '@jahia/ds-mui-theme';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import EmptyTable from './EmptyTable';

describe('EmptyTable', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            labelEmpty: '',
            classes: {}
        };
    });

    it('should display EmptyTable', () => {
        const cmp = shallowWithTheme(
            <EmptyTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        cmp.find('WithStyles(EmptyTable)').exists();
    });

    it('should display label inside the table', () => {
        defaultProps.labelEmpty = 'The table is empty';

        const cmp = shallowWithTheme(
            <EmptyTable {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.find('DsTypography').debug()).toContain('The table is empty');
    });
});
