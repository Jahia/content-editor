import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import React from 'react';
import {listOrderingFieldSet} from './AutomaticOrdering.spec.data';
import {AutomaticOrdering} from './AutomaticOrdering';
import {useContentEditorContext} from '~/contexts';
import {adaptSectionToDisplayableRows, getDisplayedRows} from './AutomaticOrdering.utils';
import {Constants} from '~/ContentEditor.constants';
import {useFormikContext} from 'formik';

jest.mock('formik');
jest.mock('~/contexts/ContentEditor/ContentEditor.context');
jest.mock('~/contexts/ContentEditorConfig/ContentEditorConfig.context');
jest.mock('~/contexts/ContentEditorSection/ContentEditorSection.context');

describe('Automatic ordering component', () => {
    let props;
    let formik;
    let context;

    beforeEach(() => {
        context = {
            nodeData: {
                lockedAndCannotBeEdited: false,
                hasWritePermission: true
            }
        };
        useContentEditorContext.mockReturnValue(context);
        formik = {
            values: {
                [Constants.ordering.automaticOrdering.mixin + '_firstField']: undefined,
                [Constants.ordering.automaticOrdering.mixin + '_secondField']: undefined,
                [Constants.ordering.automaticOrdering.mixin + '_thirdField']: undefined,
                [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: 'asc',
                [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: 'asc',
                [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: 'asc'
            },
            setFieldValue: jest.fn(),
            setFieldTouched: jest.fn()
        };
        useFormikContext.mockReturnValue(formik);
        props = {
            classes: {}
        };
    });

    it('should display one row only when no props set', () => {
        props.orderingFieldSet = listOrderingFieldSet(false, false);
        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        console.log(cmp.debug());
        expect(cmp.find('FieldContainer').length).toBe(2);
    });

    it('should display rows when properties exists', () => {
        props.orderingFieldSet = listOrderingFieldSet(false, false);
        formik.values[Constants.ordering.automaticOrdering.mixin + '_secondField'] = 'jcr:created';
        formik.values[Constants.ordering.automaticOrdering.mixin + '_thirdField'] = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').length).toBe(4);
    });

    it('should disable add when props are readOnly', () => {
        props.orderingFieldSet = listOrderingFieldSet(true, true);

        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Button').props().isDisabled).toBe(true);
    });

    it('should disable remove when props are readOnly', () => {
        props.orderingFieldSet = listOrderingFieldSet(true, true);
        formik.values[Constants.ordering.automaticOrdering.mixin + '_secondField'] = 'jcr:created';
        formik.values[Constants.ordering.automaticOrdering.mixin + '_thirdField'] = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').at(1).props().inputContext.actionRender.props.disabled).toBe(true);
        expect(cmp.find('FieldContainer').at(3).props().inputContext.actionRender.props.disabled).toBe(true);
    });

    it('should add rows when click on "Add" button, to a maximum of 3 rows, then the button should be disabled', () => {
        props.orderingFieldSet = listOrderingFieldSet(false, false);

        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Button').props().isDisabled).toBe(false);
        expect(cmp.find('FieldContainer').length).toBe(2);

        cmp.find('Button').simulate('click');
        expect(cmp.find('FieldContainer').length).toBe(4);
        expect(cmp.find('Button').props().isDisabled).toBe(false);
        expect(formik.setFieldValue.mock.calls[0]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondField', 'jcr:lastModified']);
        expect(formik.setFieldValue.mock.calls[1]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondDirection', 'desc']);
        expect(formik.setFieldTouched.mock.calls[0]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondField', true, false]);
        expect(formik.setFieldTouched.mock.calls[1]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondDirection', true, false]);

        cmp.find('Button').simulate('click');
        expect(cmp.find('FieldContainer').length).toBe(6);
        expect(cmp.find('Button').props().isDisabled).toBe(true);
        expect(formik.setFieldValue.mock.calls[2]).toEqual([Constants.ordering.automaticOrdering.mixin + '_thirdField', 'jcr:lastModified']);
        expect(formik.setFieldValue.mock.calls[3]).toEqual([Constants.ordering.automaticOrdering.mixin + '_thirdDirection', 'desc']);
        expect(formik.setFieldTouched.mock.calls[2]).toEqual([Constants.ordering.automaticOrdering.mixin + '_thirdField', true, false]);
        expect(formik.setFieldTouched.mock.calls[3]).toEqual([Constants.ordering.automaticOrdering.mixin + '_thirdDirection', true, false]);
    });

    it('should remove rows when click on "Remove" button', () => {
        props.orderingFieldSet = listOrderingFieldSet(false, false);
        formik.values[Constants.ordering.automaticOrdering.mixin + '_secondField'] = 'jcr:created';
        formik.values[Constants.ordering.automaticOrdering.mixin + '_thirdField'] = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrdering {...props}/>,
            {},
            dsGenericTheme
        );
        // Insure 2 row display
        expect(cmp.find('FieldContainer').length).toBe(4);

        // Click on remove on first row (secondField prop)
        cmp.find('FieldContainer').at(1).props().inputContext.actionRender.props.onClick();

        // Verify formik is updated correctly by removed of secondField
        expect(formik.setFieldValue.mock.calls[0]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondField', undefined]);
        expect(formik.setFieldValue.mock.calls[1]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondDirection', undefined]);
        expect(formik.setFieldTouched.mock.calls[0]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondField', true, false]);
        expect(formik.setFieldTouched.mock.calls[1]).toEqual([Constants.ordering.automaticOrdering.mixin + '_secondDirection', true, false]);

        // Insure only one row display left
        expect(cmp.find('FieldContainer').length).toBe(2);

        // Insure remove button is not display when only one row left
        expect(cmp.find('FieldContainer').at(1).props().inputContext.actionRender).toBe(undefined);
    });

    it('should getRows, and displayed rows', () => {
        const rows = adaptSectionToDisplayableRows(listOrderingFieldSet(false, false), t => t);

        // Should transform section in displayable rows
        expect(rows.length).toBe(3);
        expect(rows[0].propField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_firstField');
        expect(rows[0].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[0].directionField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_firstDirection');
        expect(rows[0].directionField.displayName).toBe('Order direction');

        expect(rows[1].propField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_secondField');
        expect(rows[1].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[1].directionField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_secondDirection');
        expect(rows[1].directionField.displayName).toBe('Order direction');

        expect(rows[2].propField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_thirdField');
        expect(rows[2].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[2].directionField.name).toBe(Constants.ordering.automaticOrdering.mixin + '_thirdDirection');
        expect(rows[2].directionField.displayName).toBe('Order direction');

        // Should always return one row to be displayed in case no props
        expect(getDisplayedRows(rows, {
            [Constants.ordering.automaticOrdering.mixin + '_firstField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_secondField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_thirdField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: 'asc'
        })).toStrictEqual([0]);

        // Should always return displayed rows in case props are set
        expect(getDisplayedRows(rows, {
            [Constants.ordering.automaticOrdering.mixin + '_firstField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_secondField']: 'jcr:created',
            [Constants.ordering.automaticOrdering.mixin + '_thirdField']: 'jcr:createdBy',
            [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: 'asc'
        })).toStrictEqual([1, 2]);

        expect(getDisplayedRows(rows, {
            [Constants.ordering.automaticOrdering.mixin + '_firstField']: 'jcr:created',
            [Constants.ordering.automaticOrdering.mixin + '_secondField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_thirdField']: 'jcr:createdBy',
            [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: 'asc'
        })).toStrictEqual([0, 2]);

        // In case no rows provided, no rows can be displayed
        expect(getDisplayedRows([], {
            [Constants.ordering.automaticOrdering.mixin + '_firstField']: 'jcr:created',
            [Constants.ordering.automaticOrdering.mixin + '_secondField']: undefined,
            [Constants.ordering.automaticOrdering.mixin + '_thirdField']: 'jcr:createdBy',
            [Constants.ordering.automaticOrdering.mixin + '_firstDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_secondDirection']: 'asc',
            [Constants.ordering.automaticOrdering.mixin + '_thirdDirection']: 'asc'
        })).toStrictEqual([]);
    });
});
