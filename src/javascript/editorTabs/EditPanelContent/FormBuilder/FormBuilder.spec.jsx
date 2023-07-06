import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import {FormBuilder} from './FormBuilder';
import {useFormikContext} from 'formik';
import {useContentEditorContext, useContentEditorConfigContext, useContentEditorSectionContext} from '~/contexts';
import {Constants} from '~/ContentEditor.constants';

jest.mock('connected-react-router', () => ({}));
jest.mock('formik');
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');
jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(() => ({content: true, listOrdering: true}))
}));

describe('FormBuilder component', () => {
    let context;
    let sectionContext;
    let formik;
    beforeEach(() => {
        context = {
            nodeData: {
                isSite: false,
                isPage: false,
                primaryNodeType: {
                    hasOrderableChildNodes: true
                }
            }
        };
        useContentEditorContext.mockReturnValue(context);
        useContentEditorConfigContext.mockReturnValue({});
        sectionContext = {
            sections: [
                {
                    name: 'content',
                    displayName: 'Content',
                    expanded: false,
                    visible: true,
                    fieldSets: [
                        {
                            displayName: 'yo1',
                            displayed: true,
                            visible: true,
                            fields: [
                                {name: 'field1', displayName: 'field 1', visible: true},
                                {name: 'field2', displayName: 'field 2', visible: true}
                            ]
                        },
                        {
                            displayName: 'yo2',
                            displayed: true,
                            visible: true,
                            fields: [
                                {name: 'field21', displayName: 'field 21', visible: true},
                                {name: 'field22', displayName: 'field 22', visible: true}
                            ]
                        }
                    ]
                },
                {
                    name: 'layout',
                    displayName: 'Layout',
                    expanded: false,
                    visible: true,
                    fieldSets: [
                        {
                            displayName: 'yo1',
                            displayed: true,
                            visible: true,
                            fields: [
                                {name: 'field1', displayName: 'field 1', visible: true},
                                {name: 'field2', displayName: 'field 2', visible: true}
                            ]
                        },
                        {
                            displayName: 'yo2',
                            displayed: true,
                            visible: true,
                            fields: [
                                {name: 'field21', displayName: 'field 21', visible: true},
                                {name: 'field22', displayName: 'field 22', visible: true}
                            ]
                        }
                    ]
                }
            ]
        };
        useContentEditorSectionContext.mockReturnValue(sectionContext);
        formik = {
            values: {
                [Constants.ordering.childrenKey]: [{}]
            }
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should be empty', () => {
        sectionContext.sections = [];
        const cmp = shallowWithTheme(<FormBuilder mode="create" formKey="dummy-uuid-create"/>, {}, dsGenericTheme);

        expect(cmp.debug()).toBe('<Fragment />');
    });

    it('should display each section', () => {
        const cmp = shallowWithTheme(<FormBuilder mode="create" formKey="dummy-uuid-create-1"/>, {}, dsGenericTheme).find('section');
        expect(cmp.props()['data-sel-mode']).toBe('create');
        expect(cmp.children().length).toEqual(sectionContext.sections.length);
    });

    it('should not display ordering section if not there', () => {
        sectionContext.sections.push({
            name: 'listOrdering',
            displayName: 'Listordering',
            expanded: false,
            fieldSets: [
            ]
        });
        const cmp = shallowWithTheme(<FormBuilder mode="create" formKey="dummy-uuid-create-2"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').dive().find('Collapsible').exists()).toBeFalsy();
    });

    it('should display ordering section if available', () => {
        sectionContext.sections.push({
            name: 'listOrdering',
            displayName: 'Listordering',
            expanded: false,
            fieldSets: [
                {
                    name: 'jmix:orderedList',
                    displayed: true,
                    fields: [
                        {name: 'jmix:orderedList_ce:manualOrdering'}
                    ]
                }
            ]
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit" formKey="dummy-uuid-edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').dive().find('Collapsible').exists()).toBeTruthy();
    });

    it('should display ordering section just after content section', () => {
        sectionContext.sections.push({
            name: 'listOrdering',
            displayName: 'Listordering',
            expanded: false,
            fieldSets: [
                {
                    name: 'jmix:orderedList',
                    displayed: true,
                    fields: [
                        {name: 'jmix:orderedList_ce:manualOrdering'}
                    ]
                }
            ]
        });
        const cmp = shallowWithTheme(<FormBuilder mode="edit" formKey="dummy-uuid-edit-3"/>, {}, dsGenericTheme).find('section');
        expect(cmp.childAt(1).find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should expand content and listOrdering by default', () => {
        sectionContext.sections.push({
            name: 'listOrdering',
            displayName: 'Listordering',
            expanded: false,
            fieldSets: [
                {
                    displayName: 'yo1',
                    displayed: true,
                    fields: [
                        {name: 'field1', displayName: 'field 1'},
                        {name: 'field2', displayName: 'field 2'}
                    ]
                }
            ]
        });

        const cmp = shallowWithTheme(<FormBuilder mode="edit" formKey="dummy-uuid-edit-4"/>, {}, dsGenericTheme).find('section');
        let props = cmp.childAt(0).dive().find('Collapsible').props();
        expect(props.label).toBe('Content');
        expect(props.isExpanded).toBeTruthy();

        props = cmp.childAt(1).dive().find('Collapsible').props();
        expect(props.label).toBe('translated_content-editor:label.contentEditor.section.listAndOrdering.title');
        expect(props.isExpanded).toBeTruthy();

        props = cmp.childAt(2).dive().find('Collapsible').props();
        expect(props.label).toBe('Layout');
        expect(props.isExpanded).toBeFalsy();
    });

    // Had to disable the test for now, to properly test it we need to implement more or less full redux functionality
    // mocking doesn't work as we need sttore to update and component to react to that update. I tried a few store
    // implementations but none of them is able to provide context for useSelector hook, whihc leads to an error.
    // When we migrate to cypress it should be much easier to test.
    // it('should expand given settings from server', () => {
    //     sectionContext.sections[1].expanded = true;
    //
    //     sectionContext.sections.push({
    //         name: 'listOrdering',
    //         displayName: 'Listordering',
    //         expanded: false,
    //         fieldSets: [
    //             {
    //                 displayName: 'yo1',
    //                 displayed: true,
    //                 fields: [
    //                     {name: 'field1', displayName: 'field 1'},
    //                     {name: 'field2', displayName: 'field 2'}
    //                 ]
    //             }
    //         ]
    //     });
    //
    //     const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
    //     let props = cmp.childAt(0).dive().find('Collapsible').props();
    //     expect(props.label).toBe('Content');
    //     expect(props.isExpanded).toBeTruthy();
    //
    //     props = cmp.childAt(1).dive().find('Collapsible').props();
    //     expect(props.label).toBe('Listordering');
    //     expect(props.isExpanded).toBeTruthy();
    //
    //     props = cmp.childAt(2).dive().find('Collapsible').props();
    //     expect(props.label).toBe('Layout');
    //     expect(props.isExpanded).toBeTruthy();
    // });
});
