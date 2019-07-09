import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {DropdownIndicator} from './DropdownIndicator';

describe('DropdownIndicator', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            innerProps: {},
            children: () => ''
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <DropdownIndicator {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
