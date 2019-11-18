import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Control} from './Control';

describe('Control', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            innerProps: {},
            children: '',
            menuIsOpen: false,
            isFocused: false,
            isDisabled: false,
            selectProps: {
                isReadOnly: false
            }
        };
    });

    it('should not throw an error', () => {
        const cmp = shallowWithTheme(
            <Control {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp).toBeTruthy();
    });
});
