import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ChildrenSectionCmp} from './ChildrenSection';
import {setContext} from '~/ContentEditor.context';

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

describe('Children section component', () => {
    let props;
    let context;
    beforeEach(() => {
        context = {
            nodeData: {
                lockedAndCannotBeEdited: false,
                hasWritePermission: true
            }
        };

        props = {
            section: {
                displayName: 'children'
            },
            formik: {
                values: {
                    'jmix:orderedList': false
                },
                handleChange: jest.fn()
            },
            classes: {}
        };
    });

    it('should display section name', () => {
        setContext(context);
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.debug()).toContain(props.section.displayName);
    });

    it('should be able to switch automatic ordering', () => {
        setContext(context);
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        toggleCmp.simulate('change');
        expect(toggleCmp.props().readOnly).toBe(false);
        expect(props.formik.handleChange).toHaveBeenCalled();
    });

    it('should not be able to switch automatic ordering, if node is locked', () => {
        context.nodeData.lockedAndCannotBeEdited = true;
        setContext(context);
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').props().readOnly).toBe(true);
    });

    it('should not be able to switch automatic ordering, if node is locked', () => {
        context.nodeData.hasWritePermission = false;
        setContext(context);
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').props().readOnly).toBe(true);
    });

    it('should not be able to switch automatic ordering', () => {
        setContext(context);
        delete props.formik.values['jmix:orderedList'];
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').length).toBe(0);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display manual ordering', () => {
        setContext(context);
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display automatic ordering', () => {
        setContext(context);
        props.formik.values['jmix:orderedList'] = true;
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(0);
        expect(cmp.find('AutomaticOrdering').length).toBe(1);
    });
});
