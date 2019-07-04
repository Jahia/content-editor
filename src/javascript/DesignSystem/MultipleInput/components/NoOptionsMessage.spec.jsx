import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {NoOptionsMessage} from './NoOptionsMessage';

describe('NoOptionsMessage', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            selectProps: {
                styles: {
                    noOptionsMessage: 'classNameChelou'
                }
            },
            children: ''
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <NoOptionsMessage {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
