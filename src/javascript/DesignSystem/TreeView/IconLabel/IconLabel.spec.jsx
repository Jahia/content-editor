import React from 'react';

import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {IconLabel} from './IconLabel';

describe('IconLabel', () => {
    it('should display the label', () => {
        const cmp = shallowWithTheme(
            <IconLabel label="thisIsATest"/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('thisIsATest');
    });

    it('should display the icon', () => {
        const cmp = shallowWithTheme(
            <IconLabel label="toto" iconURL="https://image.flaticon.com/icons/svg/1973/1973617.svg"/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain('https://image.flaticon.com/icons/svg/1973/1973617.svg');
    });
});
