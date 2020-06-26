import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import React from 'react';
import {listOrderingSection} from './AutomaticOrdering.spec.data';
import {AutomaticOrderingCmp} from './AutomaticOrdering';
import {setSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {
    adaptSectionToDisplayableRows,
    getDisplayedRows
} from './AutomaticOrdering.utils';

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
    beforeEach(() => {
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
                }
            }
        };
    });

    it('should display one row only when no props set', () => {
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').length).toBe(2);
    });

    it('should display rows when properties exists', () => {
        setSectionContext(sectionContext);
        props.formik.values.secondField = 'jcr:created';
        props.formik.values.thirdField = 'jcr:createdBy';

        const cmp = shallowWithTheme(
            <AutomaticOrderingCmp {...props}/>,
            {},
            dsGenericTheme
        );
        expect(cmp.find('FieldContainer').length).toBe(4);
    });

    it('should add rows when click on "Add" button, to a maximum of 3 rows, then the button should be disabled', () => {
        setSectionContext(sectionContext);

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
        cmp.find('Button').simulate('click');
        expect(cmp.find('FieldContainer').length).toBe(6);
        expect(cmp.find('Button').props().disabled).toBe(true);
    });

    it('should getRows, and displayed rows', () => {
        const rows = adaptSectionToDisplayableRows([listOrderingSection]);

        // Should transform section in displayable rows
        expect(rows.length).toBe(3);
        expect(rows[0].propField.name).toBe('firstField');
        expect(rows[0].directionField.name).toBe('firstDirection');
        expect(rows[1].propField.name).toBe('secondField');
        expect(rows[1].directionField.name).toBe('secondDirection');
        expect(rows[2].propField.name).toBe('thirdField');
        expect(rows[2].directionField.name).toBe('thirdDirection');

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
