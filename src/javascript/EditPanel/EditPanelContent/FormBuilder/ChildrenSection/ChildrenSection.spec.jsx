import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ChildrenSectionCmp} from './ChildrenSection';

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
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.debug()).toContain(props.section.displayName);
    });

    it('should be able to switch automatic ordering', () => {
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        cmp.find('WithStyles(ToggleCmp)').simulate('change');
        expect(props.formik.handleChange).toHaveBeenCalled();
    });

    it('should not be able to switch automatic ordering', () => {
        delete props.formik.values['jmix:orderedList'];
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('WithStyles(ToggleCmp)').length).toBe(0);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display manual ordering', () => {
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display automatic ordering', () => {
        props.formik.values['jmix:orderedList'] = true;
        const cmp = shallowWithTheme(<ChildrenSectionCmp {...props}/>, {}, dsGenericTheme);
        expect(cmp.find('ManualOrdering').length).toBe(0);
        expect(cmp.find('AutomaticOrdering').length).toBe(1);
    });
});
