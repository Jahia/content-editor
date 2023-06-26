import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {ChildrenSection} from './ChildrenSection';
import {listOrderingFieldSet} from './AutomaticOrdering/AutomaticOrdering.spec.data';
import {useFormikContext} from 'formik';
import {Constants} from '~/ContentEditor.constants';

jest.mock('formik');
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');

describe('Children section component', () => {
    let props;
    let formik;
    beforeEach(() => {
        props = {
            section: {
                displayName: 'children',
                fieldSets: []
            },
            values: {},
            isExpanded: true,
            onClick: () => {
            }
        };
        formik = {
            values: {
                'Children::Order': ['item'],
                'jmix:orderedList': false
            },
            handleChange: jest.fn()
        };
        useFormikContext.mockReturnValue(formik);
    });

    it('should be able to switch automatic ordering', () => {
        props.section = {fieldSets: [listOrderingFieldSet(false, false)]};
        props.values[Constants.ordering.automaticOrdering.mixin] = '';

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);
        const toggleCmp = cmp.find('WithStyles(ToggleCmp)');
        toggleCmp.simulate('change');

        expect(toggleCmp.props().readOnly).toBe(false);
        expect(formik.handleChange).toHaveBeenCalled();
    });

    it('should not be able to switch automatic ordering, if fieldSet is readOnly', () => {
        props.section = {fieldSets: [listOrderingFieldSet(true, false)]};
        props.values[Constants.ordering.automaticOrdering.mixin] = '';

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('WithStyles(ToggleCmp)').props().readOnly).toBe(true);
    });

    it('should not be able to switch automatic ordering', () => {
        const fieldSet = listOrderingFieldSet(false, false);
        fieldSet.fields = fieldSet.fields.filter(f => f.name === 'jmix:orderedList_ce:manualOrdering');
        props.section = {fieldSets: [fieldSet]};

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('WithStyles(ToggleCmp)').length).toBe(0);
        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display manual ordering', () => {
        props.section = {fieldSets: [listOrderingFieldSet(false, false)]};

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('ManualOrdering').length).toBe(1);
        expect(cmp.find('AutomaticOrdering').length).toBe(0);
    });

    it('should display automatic ordering', () => {
        props.section = {fieldSets: [listOrderingFieldSet(false, false)]};
        formik.values['jmix:orderedList'] = true;

        const cmp = shallowWithTheme(<ChildrenSection {...props}/>, {}, dsGenericTheme);

        expect(cmp.find('ManualOrdering').length).toBe(0);
        expect(cmp.find('AutomaticOrdering').length).toBe(1);
    });
});
