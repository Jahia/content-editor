import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {SearchInput} from './Search';

describe('Picker Search', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedPath: 'aPath',
            placeholder: 'hello'
        };
    });

    it('should display the placeholder', () => {
        const cmp = shallowWithTheme(
            <SearchInput {...props}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.debug()).toContain('hello');
    });
});
