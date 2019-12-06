import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {SearchInput} from './Search';

describe('Picker Search', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedPath: 'aPath',
            placeholder: 'hello',
            onChange: jest.fn()
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

    it('should bind onChange correctly', () => {
        const cmp = shallowWithTheme(
            <SearchInput {...props}/>,
            {},
            dsGenericTheme
        );
        cmp.simulate('change');
        expect(props.onChange).toHaveBeenCalled();
    });
});
