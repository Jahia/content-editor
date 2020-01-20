import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {FieldSet} from './FieldSet';

jest.mock('~/ContentEditor.context', () => {
    let contextmock;
    return {
        useContentEditorContext: () => {
            return contextmock;
        },
        setContext: c => {
            contextmock = c;
        }
    };
});

import {setContext} from '~/ContentEditor.context';

describe('FieldSet component', () => {
    let props;
    let context = {
        sections: [
            {
                name: 'metadata',
                displayName: 'metadata',
                fieldSets: [{
                    displayName: 'FieldSet1',
                    dynamic: false,
                    fields: [
                        {displayName: 'field1'},
                        {displayName: 'field2'}
                    ]
                }]
            }
        ],
        nodeData: {
            lockedAndCannotBeEdited: false
        }
    };

    beforeEach(() => {
        props = {
            fieldset: {
                displayName: 'FieldSet1',
                dynamic: false,
                fields: [
                    {displayName: 'field1', name: 'field1'},
                    {displayName: 'field2', name: 'field2'}
                ]
            },
            formik: {}
        };
    });

    it('should display FieldSet name', () => {
        setContext(context);
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
        setContext(context);
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
        setContext(context);
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
        let overridedContext = context;
        overridedContext.nodeData.lockedAndCannotBeEdited = true;
        setContext(overridedContext);
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
        expect(toggleCmp.props().readOnly).toBe(true);
    });

    it('should not display toggle for non dynamic FieldSet', () => {
        setContext(context);
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
