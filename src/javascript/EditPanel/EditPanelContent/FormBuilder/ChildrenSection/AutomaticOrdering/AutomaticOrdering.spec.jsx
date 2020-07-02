import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import React from 'react';
import {listOrderingSection} from './AutomaticOrdering.spec.data';
import {AutomaticOrderingCmp} from './AutomaticOrdering';
import {setSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {setContext} from '~/ContentEditor.context';
import {
    adaptSectionToDisplayableRows,
    getDisplayedRows
} from './AutomaticOrdering.utils';

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

jest.mock('~/ContentEditorSection/ContentEditorSection.context', () => {
    let sectionContextmock;
    return {
        useContentEditorSectionContext: () => {
            return sectionContextmock;
        },
        setSectionContext: c => {
            sectionContextmock = c;
        }
    };
});

describe('Automatic ordering component', () => {
    let props;
    let sectionContext;
    let context;
    beforeEach(() => {
        context = {
            nodeData: {
                lockedAndCannotBeEdited: false,
                hasWritePermission: true
            }
        };

        sectionContext = {
            sections: [listOrderingSection]
        };

        props = {
            formik: {
                values: {
                    firstField: undefined,
                    secondField: undefined,
                    thirdField: undefined,
                    firstDirection: 'asc',
                    secondDirection: 'asc',
                    thirdDirection: 'asc'
                },
                setFieldValue: jest.fn(),
                setFieldTouched: jest.fn()
            },
            classes: {}
        };
    });

    it('should display one row only when no props set', () => {
        setSectionContext(sectionContext);
        setContext(context);

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').length).toBe(2);
    });

    it('should display rows when properties exists', () => {
        setSectionContext(sectionContext);
        setContext(context);
        props.formik.values.secondField = 'jcr:created';
        props.formik.values.thirdField = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').length).toBe(4);
    });

    it('should disable add when node is locked', () => {
        setSectionContext(sectionContext);
        context.nodeData.lockedAndCannotBeEdited = true;
        setContext(context);

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Button').props().disabled).toBe(true);
    });

    it('should disable add when node is locked', () => {
        setSectionContext(sectionContext);
        context.nodeData.hasWritePermission = false;
        setContext(context);

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Button').props().disabled).toBe(true);
    });

    it('should disable remove when node is locked', () => {
        setSectionContext(sectionContext);
        context.nodeData.lockedAndCannotBeEdited = true;
        setContext(context);
        props.formik.values.secondField = 'jcr:created';
        props.formik.values.thirdField = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').at(1).props().inputContext.actionRender.props.disabled).toBe(true);
        expect(cmp.find('FieldContainer').at(3).props().inputContext.actionRender.props.disabled).toBe(true);
    });

    it('should disable remove if doesnt have write permission', () => {
        setSectionContext(sectionContext);
        context.nodeData.hasWritePermission = false;
        setContext(context);
        props.formik.values.secondField = 'jcr:created';
        props.formik.values.thirdField = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').at(1).props().inputContext.actionRender.props.disabled).toBe(true);
        expect(cmp.find('FieldContainer').at(3).props().inputContext.actionRender.props.disabled).toBe(true);
    });

    it('should add rows when click on "Add" button, to a maximum of 3 rows, then the button should be disabled', () => {
        setSectionContext(sectionContext);
        setContext(context);

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('Button').props().disabled).toBe(false);
        expect(cmp.find('FieldContainer').length).toBe(2);

        cmp.find('Button').simulate('click');
        expect(cmp.find('FieldContainer').length).toBe(4);
        expect(cmp.find('Button').props().disabled).toBe(false);
        expect(props.formik.setFieldValue.mock.calls[0]).toEqual(['secondField', 'jcr:lastModified', true]);
        expect(props.formik.setFieldValue.mock.calls[1]).toEqual(['secondDirection', 'desc', true]);
        expect(props.formik.setFieldTouched.mock.calls[0]).toEqual(['secondField', true]);
        expect(props.formik.setFieldTouched.mock.calls[1]).toEqual(['secondDirection', true]);

        cmp.find('Button').simulate('click');
        expect(cmp.find('FieldContainer').length).toBe(6);
        expect(cmp.find('Button').props().disabled).toBe(true);
        expect(props.formik.setFieldValue.mock.calls[2]).toEqual(['thirdField', 'jcr:lastModified', true]);
        expect(props.formik.setFieldValue.mock.calls[3]).toEqual(['thirdDirection', 'desc', true]);
        expect(props.formik.setFieldTouched.mock.calls[2]).toEqual(['thirdField', true]);
        expect(props.formik.setFieldTouched.mock.calls[3]).toEqual(['thirdDirection', true]);
    });

    it('should remove rows when click on "Remove" button', () => {
        setSectionContext(sectionContext);
        setContext(context);
        props.formik.values.secondField = 'jcr:created';
        props.formik.values.thirdField = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        // Insure 2 row display
        expect(cmp.find('FieldContainer').length).toBe(4);

        // Click on remove on first row (secondField prop)
        cmp.find('FieldContainer').at(1).props().inputContext.actionRender.props.onClick();

        // Verify formik is updated correctly by removed of secondField
        expect(props.formik.setFieldValue.mock.calls[0]).toEqual(['secondField', undefined, true]);
        expect(props.formik.setFieldValue.mock.calls[1]).toEqual(['secondDirection', undefined, true]);
        expect(props.formik.setFieldTouched.mock.calls[0]).toEqual(['secondField', true]);
        expect(props.formik.setFieldTouched.mock.calls[1]).toEqual(['secondDirection', true]);

        // Insure only one row display left
        expect(cmp.find('FieldContainer').length).toBe(2);

        // Insure remove button is not display when only one row left
        expect(cmp.find('FieldContainer').at(1).props().inputContext.actionRender).toBe(undefined);
    });

    it('should getRows, and displayed rows', () => {
        const rows = adaptSectionToDisplayableRows([listOrderingSection], s => s);

        // Should transform section in displayable rows
        expect(rows.length).toBe(3);
        expect(rows[0].propField.name).toBe('firstField');
        expect(rows[0].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[0].directionField.name).toBe('firstDirection');
        expect(rows[0].directionField.displayName).toBe('Order direction');

        expect(rows[1].propField.name).toBe('secondField');
        expect(rows[1].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[1].directionField.name).toBe('secondDirection');
        expect(rows[1].directionField.displayName).toBe('Order direction');

        expect(rows[2].propField.name).toBe('thirdField');
        expect(rows[2].propField.displayName).toBe('content-editor:label.contentEditor.section.listAndOrdering.orderBy');
        expect(rows[2].directionField.name).toBe('thirdDirection');
        expect(rows[2].directionField.displayName).toBe('Order direction');

        // Should always return one row to be displayed in case no props
        expect(getDisplayedRows(rows, {
            firstField: undefined,
            secondField: undefined,
            thirdField: undefined,
            firstDirection: 'asc',
            secondDirection: 'asc',
            thirdDirection: 'asc'
        })).toStrictEqual([0]);

        // Should always return displayed rows in case props are set
        expect(getDisplayedRows(rows, {
            firstField: undefined,
            secondField: 'jcr:created',
            thirdField: 'jcr:createdBy',
            firstDirection: 'asc',
            secondDirection: 'asc',
            thirdDirection: 'asc'
        })).toStrictEqual([1, 2]);

        expect(getDisplayedRows(rows, {
            firstField: 'jcr:created',
            secondField: undefined,
            thirdField: 'jcr:createdBy',
            firstDirection: 'asc',
            secondDirection: 'asc',
            thirdDirection: 'asc'
        })).toStrictEqual([0, 2]);

        // In case no rows provided, no rows can be displayed
        expect(getDisplayedRows([], {
            firstField: 'jcr:created',
            secondField: undefined,
            thirdField: 'jcr:createdBy',
            firstDirection: 'asc',
            secondDirection: 'asc',
            thirdDirection: 'asc'
        })).toStrictEqual([]);
    });
});
