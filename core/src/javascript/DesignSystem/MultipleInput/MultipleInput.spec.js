import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {MultipleInput} from './MultipleInput';

describe('MultipleInput', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {};
    });

    it('should use basic select when creatable props is at false', () => {
        const cmp = shallowWithTheme(
            <MultipleInput {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('StateManager')
            .dive();

        expect(cmp.name()).toBe('Select');
    });

    it('should use CreatableSelect when creatable props is at true', () => {
        defaultProps.creatable = true;
        const cmp = shallowWithTheme(
            <MultipleInput {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('StateManager')
            .dive();

        expect(cmp.name()).toBe('Creatable');
    });

    it('should disabled input when readOnly props is given', () => {
        defaultProps.readOnly = true;
        const cmp = shallowWithTheme(
            <MultipleInput {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('StateManager')
            .dive();

        expect(cmp.props().isDisabled).toBe(true);
    });

    it('should not disabled input when readOnly props is not given', () => {
        const cmp = shallowWithTheme(
            <MultipleInput {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .find('StateManager')
            .dive();

        expect(cmp.props().isDisabled).toBe(false);
    });
});
