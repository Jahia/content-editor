import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ChildrenSection} from './ChildrenSection';
import {useContentEditorSectionContext} from '~/contexts';
import {listOrderingSection} from './AutomaticOrdering/AutomaticOrdering.spec.data';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';

jest.mock('formik');
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');

describe('Children section component', () => {
    let props;
    let sectionsContext;
    let formik;
    beforeEach(() => {
        props = {
            section: {
                displayName: 'children',
                fieldSets: []
            },
            mode: Constants.routes.baseEditRoute,
            values: {},
            nodeData: {
                primaryNodeType: {
                    hasOrderableChildNodes: true
                }
            },
            isExpanded: true,
            onClick: () => {}
        };
        formik = {
            values: {
                'jmix:orderedList': false
            },
            handleChange: jest.fn()
        };
        useFormikContext.mockReturnValue(formik);
        sectionsContext = {
            sections: []
        };
        useContentEditorSectionContext.mockReturnValue(sectionsContext);
    });

    it('should be able to switch automatic ordering', () => {
        sectionsContext.sections = [listOrderingSection(false, false)];
        props.values[Constants.ordering.automaticOrdering.mixin] = '';

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);
        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        toggleCmp.simulate('change');

        expect(toggleCmp.props().readOnly).toBe(false);
        expect(formik.handleChange).toHaveBeenCalled();
    });

    it('should not be able to switch automatic ordering, if fieldSet is readOnly', () => {
        sectionsContext.sections = [listOrderingSection(true, false)];
        props.values[Constants.ordering.automaticOrdering.mixin] = '';

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('WithStyles(ToggleCmp)').props().readOnly).toBe(true);
    });

    it('should not be able to switch automatic ordering', () => {
        sectionsContext.sections = [listOrderingSection(false, false)];
        delete formik.values['jmix:orderedList'];

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('WithStyles(ToggleCmp)').length).toBe(0);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display manual ordering', () => {
        sectionsContext.sections = [listOrderingSection(false, false)];

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display automatic ordering', () => {
        sectionsContext.sections = [listOrderingSection(false, false)];
        props.canAutomaticallyOrder = true;
        formik.values['jmix:orderedList'] = true;

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('ManualOrdering').length).toBe(0);
        expect(cmp.find('AutomaticOrdering').length).toBe(1);
    });
});
