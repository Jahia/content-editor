import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {Section} from './Section';

describe('Section component', () => {
    let props;

    beforeEach(() => {
        props = {
            section: {displayName: 'content'}
        };
    });

    it('should display section name', () => {
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        expect(cmp.debug()).toContain(props.section.displayName);
    });
});
