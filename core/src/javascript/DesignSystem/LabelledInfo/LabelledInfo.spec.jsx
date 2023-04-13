import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {LabelledInfo} from './LabelledInfo';

describe('LabelledInfo', () => {
    it('should display the label', () => {
        const cmp = shallowWithTheme(
            <LabelledInfo label="thisIsATest"/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('thisIsATest');
    });

    it('should display the value', () => {
        const cmp = shallowWithTheme(
            <LabelledInfo value="thisIsATest2"/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('thisIsATest2');
    });
});
