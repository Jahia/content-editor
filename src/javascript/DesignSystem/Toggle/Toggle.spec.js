import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {Toggle} from './';

describe('Toggle', () => {
    it('should display a checked Toggle', () => {
        const cmp = shallowWithTheme(<Toggle checked/>, {}, dsGenericTheme).dive();
        expect(cmp.props().checked).toBe(true);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should display an unchecked Toggle', () => {
        const cmp = shallowWithTheme(<Toggle checked={false}/>, {}, dsGenericTheme).dive();
        expect(cmp.props().checked).toBe(false);
        expect(cmp.props().disabled).toBe(false);
    });

    it('should be disabled', () => {
        const cmp = shallowWithTheme(<Toggle disabled/>, {}, dsGenericTheme).dive();
        expect(cmp.props().disabled).toBe(true);
    });

    it('should be readonly', () => {
        const cmp = shallowWithTheme(<Toggle readOnly/>, {}, dsGenericTheme).dive();
        expect(cmp.props().disabled).toBe(true);
    });

    it('should update the checked attribute', () => {
        const toggleCmp = shallowWithTheme(<Toggle/>, {}, dsGenericTheme);
        expect(toggleCmp.dive().props().checked).toBe(false);
        toggleCmp.setProps({checked: true});
        expect(toggleCmp.dive().props().checked).toBe(true);
    });
});
