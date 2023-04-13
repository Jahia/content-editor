import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MultiValueRemove} from './MutliValueRemove';

describe('MultiValueRemove', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {};
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <MultiValueRemove {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
