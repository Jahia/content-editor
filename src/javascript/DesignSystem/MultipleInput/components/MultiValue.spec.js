import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MultiValue} from './MultiValue';

describe('MultiValue', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            className: 'yo',
            innerRef: {},
            data: {
                label: 'zertyu'
            },
            removeProps: {
                onClick: jest.fn()
            }
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <MultiValue {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
