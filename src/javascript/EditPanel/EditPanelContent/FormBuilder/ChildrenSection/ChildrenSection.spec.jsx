import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {ChildrenSection} from './ChildrenSection';

describe('Children section component', () => {
    let props;

    beforeEach(() => {
        props = {
            section: {
                displayName: 'children'
            }
        };
    });

    it('should display section name', () => {
        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme).dive();

        expect(cmp.debug()).toContain(props.section.displayName);
    });
});
