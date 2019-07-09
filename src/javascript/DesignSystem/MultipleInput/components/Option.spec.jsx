import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Option} from './Option';

describe('Option', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            innerRef: () => {},
            isFocused: false,
            innerProps: {},
            children: <div/>
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <Option {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
