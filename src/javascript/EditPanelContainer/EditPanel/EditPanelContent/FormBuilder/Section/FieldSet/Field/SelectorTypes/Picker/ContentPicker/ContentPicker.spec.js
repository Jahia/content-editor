import React from 'react';
import {ContentPicker} from './ContentPicker';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('formik', () => {
    let formikvaluesmock;

    return {
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock}}/>
        )
    };
});

describe('contentPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'contentId',
                name: 'contentId',
                readOnly: false,
                selectorType: 'ContentPicker'
            },
            id: 'contentId',
            editorContext: {},
            setActionContext: jest.fn()
        };
    });

    it('should display the ContentPickerEmpty when the field is not filed', () => {
        const cmp = shallowWithTheme(
            <ContentPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.debug()).toContain('ContentPickerEmptyCmp');
    });

    it('should display the ContentPickerFilled when the field is filed', () => {
        defaultProps.value = 'DummyValue';

        const cmp = shallowWithTheme(
            <ContentPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive()
            .dive();

        expect(cmp.debug()).toContain('ContentPickerFilledCmp');
    });
});
