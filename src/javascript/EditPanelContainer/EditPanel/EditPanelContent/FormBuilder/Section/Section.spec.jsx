import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {Section} from './Section';

describe('Section component', () => {
    let props;

    beforeEach(() => {
        props = {
            section: {
                displayName: 'content',
                fieldsets: [
                    {displayName: 'yo'},
                    {displayName: 'yo4'}
                ]
            }
        };
    });

    it('should display section name', () => {
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        expect(cmp.debug()).toContain(props.section.displayName);
    });

    it('should display each FieldSet', () => {
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        props.section.fieldsets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(true);
        });
    });
});
