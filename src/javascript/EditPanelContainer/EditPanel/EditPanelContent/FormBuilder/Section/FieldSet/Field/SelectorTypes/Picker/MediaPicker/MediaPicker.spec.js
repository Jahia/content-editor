import React from 'react';
import {MediaPicker} from './MediaPicker';
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

describe('mediaPicker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'imageid',
                name: 'imageid',
                selectorType: 'MediaPicker',
                readOnly: false
            },
            id: 'imageid',
            editorContext: {},
            setActionContext: jest.fn()
        };
    });

    it('should display the MediaPickerEmpty when the field is not filed', () => {
        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.debug()).toContain('MediaPickerEmptyCmp');
    });

    it('should display the MediaPickerFilled when the field is filed', () => {
        defaultProps.value = 'DummyValue';

        const cmp = shallowWithTheme(
            <MediaPicker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.debug()).toContain('MediaPickerFilledCmp');
    });
});
