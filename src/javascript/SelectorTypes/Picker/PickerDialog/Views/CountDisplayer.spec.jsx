import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {t} from 'react-i18next';
import {CountDisplayer} from './CountDisplayer';

describe('CountDisplayer', () => {
    beforeEach(() => {
        t.mockImplementation((key, value) => value ? `${value.totalCount} items found` : key);
    });

    it('should display the number 10 of items', () => {
        const cmp = shallowWithTheme(
            <CountDisplayer totalCount={10}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('10 items found');
    });

    it('should display the number 666 of items', () => {
        const cmp = shallowWithTheme(
            <CountDisplayer totalCount={666}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('666 items found');
    });
});
