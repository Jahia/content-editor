import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ChildrenSectionCmp} from './ChildrenSection';
import {setSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {listOrderingSection} from './AutomaticOrdering/AutomaticOrdering.spec.data';

jest.mock('~/ContentEditorSection/ContentEditorSection.context', () => {
    let sectionContextmock;
    return {
        useContentEditorSectionContext: () => {
            return sectionContextmock;
        },
        setSectionContext: listOrderingSection => {
            sectionContextmock = {
                sections: listOrderingSection ? [listOrderingSection] : []
            };
        }
    };
});

jest.mock('~/ContentEditor.context', () => {
    // TODO: BACKLOG-14370 add more unit tests
    return {
        useContentEditorContext: () => {
            return {
                nodeData: {
                    primaryNodeType: {
                        hasOrderableChildNodes: true
                    }
                }
            };
        }
    };
});

describe('Children section component', () => {
    let props;
    beforeEach(() => {
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
        setSectionContext(listOrderingSection(false, false));
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.debug()).toContain(props.section.displayName);
    });

    it('should be able to switch automatic ordering', () => {
        setSectionContext(listOrderingSection(false, false));
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        toggleCmp.simulate('change');
        expect(toggleCmp.props().readOnly).toBe(false);
        expect(props.formik.handleChange).toHaveBeenCalled();
    });

    it('should not be able to switch automatic ordering, if fieldSet is readOnly', () => {
        setSectionContext(listOrderingSection(true, false));
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').props().readOnly).toBe(true);
    });

    it('should not be able to switch automatic ordering', () => {
        setSectionContext(listOrderingSection(false, false));
        delete props.formik.values['jmix:orderedList'];
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').length).toBe(0);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display manual ordering', () => {
        setSectionContext(listOrderingSection(false, false));
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display automatic ordering', () => {
        setSectionContext(listOrderingSection(false, false));
        props.formik.values['jmix:orderedList'] = true;
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(0);
        expect(cmp.find('AutomaticOrdering').length).toBe(1);
    });
});
