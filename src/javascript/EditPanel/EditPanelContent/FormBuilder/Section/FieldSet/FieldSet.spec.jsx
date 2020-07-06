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
                dynamic: false,
                readOnly: false,
                fields: [
                    {displayName: 'field1', name: 'field1'},
                    {displayName: 'field2', name: 'field2'}
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

    it('should display not readOnly toggle for dynamic FieldSet when editor is not locked', () => {
        props.fieldset.dynamic = true;

        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        expect(toggleCmp.exists()).toBe(true);
        expect(toggleCmp.props().readOnly).toBe(false);
    });

    it('should display readOnly toggle for dynamic FieldSet when editor is locked', () => {
        props.fieldset.dynamic = true;
        props.fieldset.readOnly = true;

        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        expect(toggleCmp.exists()).toBe(true);
        expect(toggleCmp.props().readOnly).toBe(true);
    });

    it('should not display toggle for non dynamic FieldSet', () => {
        props.fieldset.dynamic = false;

        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.find('WithStyles(ToggleCmp)').exists()).toBe(false);
    });
});
