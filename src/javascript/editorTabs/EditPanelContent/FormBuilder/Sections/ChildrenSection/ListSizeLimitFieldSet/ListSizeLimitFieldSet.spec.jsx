import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {FieldSet} from '../../../FieldSet';
import {useFormikContext} from 'formik';

jest.mock('formik');

// Note that this test set is identical to test of a field set as it should be the same functionally
describe('ListSizeLimitFieldSet component', () => {
    let props;
    let formik;
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
            }
        };
        formik = {
            values: {}
        };
        useFormikContext.mockReturnValue(formik);
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
        const cmp = shallowWithTheme(
            <FieldSet {...props}/>,
            {},
            dsGenericTheme
        ).dive();

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
        ).dive();

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
        ).dive();

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
        ).dive();

        expect(cmp.find('WithStyles(ToggleCmp)').exists()).toBe(false);
    });
});
