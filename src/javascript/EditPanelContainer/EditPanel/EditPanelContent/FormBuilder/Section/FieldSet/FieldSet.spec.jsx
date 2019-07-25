import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {FieldSet} from './FieldSet';

describe('Section component', () => {
    let props;

    beforeEach(() => {
        props = {
            fieldset: {
                displayName: 'FieldSet1',
                fields: [
                    {displayName: 'field1'},
                    {displayName: 'field2'}
                ]
            }
        };
    });

    it('should display FieldSet name', () => {
        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.debug()).toContain(props.fieldset.displayName);
    });

    it('should display Field for each field in the FieldSet', () => {
        const cmp = shallowWithTheme(<FieldSet {...props}/>, {}, dsGenericTheme).dive();

        props.fieldsets.fields.forEach(field => {
            expect(cmp.find({field}).exists()).toBe(true);
        });
    });
});
