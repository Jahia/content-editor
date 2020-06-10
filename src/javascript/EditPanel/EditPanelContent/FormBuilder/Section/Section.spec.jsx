import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {Section} from './Section';

describe('Section component', () => {
    let props;

    beforeEach(() => {
        props = {
            section: {
                name: 'content',
                displayName: 'content',
                fieldSets: [
                    {
                        displayName: 'yo1',
                        displayed: true,
                        fields: [
                            {name: 'field1', displayName: 'field 1'},
                            {name: 'field2', displayName: 'field 2'}
                        ]
                    },
                    {
                        displayName: 'yo2',
                        displayed: true,
                        fields: [
                            {name: 'field21', displayName: 'field 21'},
                            {name: 'field22', displayName: 'field 22'}
                        ]
                    }
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

        props.section.fieldSets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(true);
        });
    });

    it('should display dynamic fieldSets that contain or not fields', () => {
        props.section = {
            name: 'content',
            displayName: 'content',
            fieldSets: [
                {
                    displayName: 'yo1',
                    displayed: true,
                    dynamic: true,
                    fields: []
                },
                {
                    displayName: 'yo2',
                    displayed: true,
                    dynamic: true,
                    fields: [
                        {name: 'field21', displayName: 'field 21', readOnly: true},
                        {name: 'field22', displayName: 'field 22', readOnly: true}
                    ]
                }
            ]
        };
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        props.section.fieldSets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(true);
        });
    });

    it('should display not dynamic fieldSets that contain fields not readOnly', () => {
        props.section = {
            name: 'content',
            displayName: 'content',
            fieldSets: [
                {
                    displayName: 'yo1',
                    dynamic: false,
                    displayed: true,
                    fields: [
                        {name: 'field1', displayName: 'field 1', readOnly: false},
                        {name: 'field2', displayName: 'field 2', readOnly: false}
                    ]
                },
                {
                    displayName: 'yo2',
                    dynamic: false,
                    displayed: true,
                    fields: [
                        {name: 'field21', displayName: 'field 21', readOnly: false},
                        {name: 'field22', displayName: 'field 22', readOnly: false}
                    ]
                }
            ]
        };
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        props.section.fieldSets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(true);
        });
    });

    it('should hide not dynamic fieldSets that do not contain fields', () => {
        props.section = {
            name: 'content',
            displayName: 'content',
            fieldSets: [
                {
                    displayName: 'yo1',
                    displayed: true,
                    dynamic: false,
                    fields: []
                },
                {
                    displayName: 'yo2',
                    displayed: true,
                    dynamic: false,
                    fields: []
                }
            ]
        };
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        props.section.fieldSets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(false);
        });
    });

    it('should hide not fieldSets set as not displayed', () => {
        props.section = {
            name: 'content',
            displayName: 'content',
            fieldSets: [
                {
                    displayName: 'yo1',
                    displayed: true,
                    fields: [
                        {name: 'field1', displayName: 'field 1'},
                        {name: 'field2', displayName: 'field 2'}
                    ]
                },
                {
                    displayName: 'yo2',
                    displayed: false,
                    fields: [
                        {name: 'field21', displayName: 'field 21'},
                        {name: 'field22', displayName: 'field 22'}
                    ]
                }
            ]
        };
        const cmp = shallowWithTheme(<Section {...props}/>, {}, dsGenericTheme).dive();

        props.section.fieldSets.forEach(fieldset => {
            expect(cmp.find({fieldset}).exists()).toBe(fieldset.displayed);
        });
    });
});
