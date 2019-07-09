import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {InputComponent} from './InputComponent';

describe('InputComponent', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            className: 'yo',
            innerRef: {}
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <InputComponent {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
