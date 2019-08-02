import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {FieldSet} from './FieldSet';

describe('FieldSet component', () => {
    let props;

    beforeEach(() => {
        props = {
            fieldset: {
                displayName: 'FieldSet1',
                activated: true,
                fields: [
                    {displayName: 'field1'},
                    {displayName: 'field2'}
                ]
            },
            formik: {}
        };
    });

    it('should display FieldSet name', () => {
        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.debug()).toContain(props.fieldset.displayName);
    });

    it('should display Field for each field in the FieldSet', () => {
        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        props.fieldset.fields.forEach(field => {
            expect(cmp.find({field}).exists()).toBe(true);
        });
    });

    // TODO: Add unit tests for dynamic fieldSets (sub-task: BACKLOG-10732)
});
