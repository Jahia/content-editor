import React from 'react';
import {ContentPicker} from './ContentPicker';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('formik', () => {
    let formikvaluesmock;

    return {
        setFormikValues: values => {
            formikvaluesmock = values;
        },
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock}}/>
        )
    };
});

import {setFormikValues} from 'formik';

describe('contentPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                formDefinition: {
                    name: 'contentId',
                    readOnly: false,
                    selectorType: 'ContentPicker'
                },
                jcrDefinition: {},
                targets: [],
                data: {
                    name: 'contentId'
                }
            },
            id: 'contentId',
            editorContext: {},
            setActionContext: jest.fn()
        };

        setFormikValues({contentId: 'ojrzoij'});
    });

    it('should display the ContentPickerEmpty when the field is not filed', () => {
        setFormikValues({contentId: null});

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
